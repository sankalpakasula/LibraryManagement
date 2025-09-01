import type { Book } from "@/components/book-item";
import { connectToDatabase } from "./mongodb";

export async function getBooks(): Promise<Book[]> {
  try {
    const { db } = await connectToDatabase();
    const books = await db
      .collection("books")
      .find({})
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
