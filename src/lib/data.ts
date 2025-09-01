import type { Book } from "@/components/book-item";
import { connectToDatabase } from "./mongodb";

const initialBooks = [
  // CSE Books
  { title: "Cracking the Coding Interview", author: "Gayle Laakmann McDowell", copies: 10 },
  { title: "Introduction to Algorithms", author: "Thomas H. Cormen et al.", copies: 5 },
  { title: "Clean Code: A Handbook of Agile Software Craftsmanship", author: "Robert C. Martin", copies: 8 },
  { title: "Design Patterns: Elements of Reusable Object-Oriented Software", author: "Erich Gamma et al.", copies: 7 },
  { title: "The Pragmatic Programmer: Your Journey to Mastery", author: "Andrew Hunt & David Thomas", copies: 9 },
  { title: "Structure and Interpretation of Computer Programs", author: "Harold Abelson et al.", copies: 4 },
  { title: "Code: The Hidden Language of Computer Hardware and Software", author: "Charles Petzold", copies: 6 },
  { title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell & Peter Norvig", copies: 3 },
  { title: "Database System Concepts", author: "Abraham Silberschatz et al.", copies: 5 },
  { title: "Operating System Concepts", author: "Abraham Silberschatz et al.", copies: 5 },

  // Business Books
  { title: "The Lean Startup: How Today's Entrepreneurs Use Continuous Innovation", author: "Eric Ries", copies: 12 },
  { title: "Zero to One: Notes on Startups, or How to Build the Future", author: "Peter Thiel", copies: 10 },
  { title: "Good to Great: Why Some Companies Make the Leap... and Others Don't", author: "Jim Collins", copies: 8 },
  { title: "How to Win Friends and Influence People", author: "Dale Carnegie", copies: 15 },
  { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", copies: 7 },
  { title: "The 7 Habits of Highly Effective People", author: "Stephen R. Covey", copies: 14 },
  { title: "Blue Ocean Strategy: How to Create Uncontested Market Space", author: "W. Chan Kim & Renée Mauborgne", copies: 6 },
  { title: "The Innovator's Dilemma: When New Technologies Cause Great Firms to Fail", author: "Clayton M. Christensen", copies: 5 },
  { title: "Measure What Matters: How Google, Bono, and the Gates Foundation Rock the World with OKRs", author: "John Doerr", copies: 9 },
  { title: "Venture Deals: Be Smarter Than Your Lawyer and Venture Capitalist", author: "Brad Feld & Jason Mendelson", copies: 4 },
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
        imageUrl: `https://picsum.photos/seed/${encodeURIComponent(book.title)}/300/400`,
        width: 300,
        height: 400,
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