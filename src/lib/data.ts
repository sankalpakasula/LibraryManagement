import type { Book } from "@/components/book-item";
import { connectToDatabase } from "./mongodb";

const initialBooks = [
  // CSE Books
  { title: "Cracking the Coding Interview", author: "Gayle Laakmann McDowell", copies: 10, category: "Technology" },
  { title: "Introduction to Algorithms", author: "Thomas H. Cormen et al.", copies: 5, category: "Technology" },
  { title: "Clean Code: A Handbook of Agile Software Craftsmanship", author: "Robert C. Martin", copies: 8, category: "Technology" },
  { title: "Design Patterns: Elements of Reusable Object-Oriented Software", author: "Erich Gamma et al.", copies: 7, category: "Technology" },
  { title: "The Pragmatic Programmer: Your Journey to Mastery", author: "Andrew Hunt & David Thomas", copies: 9, category: "Technology" },
  { title: "Structure and Interpretation of Computer Programs", author: "Harold Abelson et al.", copies: 4, category: "Technology" },
  { title: "Code: The Hidden Language of Computer Hardware and Software", author: "Charles Petzold", copies: 6, category: "Technology" },
  { title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell & Peter Norvig", copies: 3, category: "Science" },
  { title: "Database System Concepts", author: "Abraham Silberschatz et al.", copies: 5, category: "Technology" },
  { title: "Operating System Concepts", author: "Abraham Silberschatz et al.", copies: 5, category: "Technology" },

  // Business Books
  { title: "The Lean Startup: How Today's Entrepreneurs Use Continuous Innovation", author: "Eric Ries", copies: 12, category: "Business" },
  { title: "Zero to One: Notes on Startups, or How to Build the Future", author: "Peter Thiel", copies: 10, category: "Business" },
  { title: "Good to Great: Why Some Companies Make the Leap... and Others Don't", author: "Jim Collins", copies: 8, category: "Business" },
  { title: "How to Win Friends and Influence People", author: "Dale Carnegie", copies: 15, category: "Business" },
  { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", copies: 7, category: "Science" },
  { title: "The 7 Habits of Highly Effective People", author: "Stephen R. Covey", copies: 14, category: "Business" },
  { title: "Blue Ocean Strategy: How to Create Uncontested Market Space", author: "W. Chan Kim & Renée Mauborgne", copies: 6, category: "Business" },
  { title: "The Innovator's Dilemma: When New Technologies Cause Great Firms to Fail", author: "Clayton M. Christensen", copies: 5, category: "Business" },
  { title: "Measure What Matters: How Google, Bono, and the Gates Foundation Rock the World with OKRs", author: "John Doerr", copies: 9, category: "Business" },
  { title: "Venture Deals: Be Smarter Than Your Lawyer and Venture Capitalist", author: "Brad Feld & Jason Mendelson", copies: 4, category: "Business" },
  
  // Other categories for variety
  { title: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari", copies: 11, category: "History" },
  { title: "Dune", author: "Frank Herbert", copies: 9, category: "Fantasy" },
  { title: "1984", author: "George Orwell", copies: 13, category: "Fiction" },
  { title: "The Martian", author: "Andy Weir", copies: 8, category: "Science Fiction" },
  { title: "Steve Jobs", author: "Walter Isaacson", copies: 7, category: "Biography" },
  { title: "The Da Vinci Code", author: "Dan Brown", copies: 14, category: "Mystery" },
  { title: "To Kill a Mockingbird", author: "Harper Lee", copies: 10, category: "Fiction" },
  { title: "A Brief History of Time", author: "Stephen Hawking", copies: 6, category: "Science" },
  { title: "The Lord of the Rings", author: "J.R.R. Tolkien", copies: 5, category: "Fantasy" },
  { title: "Educated: A Memoir", author: "Tara Westover", copies: 9, category: "Biography" }
];

async function seedDatabase() {
  try {
    const { db } = await connectToDatabase();
    const booksCollection = db.collection("books");
    
    const count = await booksCollection.countDocuments();
    if (count === 0) {
      console.log("No books found, seeding database...");
      const booksToInsert = initialBooks.map(book => ({
        ...book,
        available: book.copies,
        status: 'Available',
        imageUrl: `https://picsum.photos/seed/${encodeURIComponent(book.title)}/200/300`,
        width: 200,
        height: 300,
        dataAiHint: 'book cover',
        dueDate: null,
      }));
      await booksCollection.insertMany(booksToInsert);
      console.log("Database seeded successfully.");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}


export async function getBooks(): Promise<Book[]> {
  try {
    await seedDatabase();
    const { db } = await connectToDatabase();
    const books = await db
      .collection("books")
      .find({})
      .sort({ title: 1 }) // Sort books alphabetically by title
      .toArray();

    // The _id field from MongoDB is an ObjectId, which is not directly serializable
    // for Next.js server components. We need to convert it to a string.
    return books.map((book) => {
      const { _id, ...rest } = book;
      return {
        id: _id.toString(),
        ...rest,
      } as Book;
    });
  } catch (error) {
    console.error("Error fetching books from MongoDB:", error);
    // In a real application, you'd want to handle this error more gracefully.
    // For now, we'll return an empty array.
    return [];
  }
}
