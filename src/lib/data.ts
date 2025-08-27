
import type { Book } from "@/components/book-item";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { firebaseApp } from "./firebase";

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(firebaseApp);

export async function getBooks(): Promise<Book[]> {
  const querySnapshot = await getDocs(collection(db, "books"));
  const books: Book[] = [];
  querySnapshot.forEach((doc) => {
    // Note: This assumes your document structure in Firestore matches the Book type.
    // You might need to adjust this mapping based on your actual data.
    const data = doc.data();
    books.push({
      id: doc.id,
      title: data.title,
      author: data.author,
      status: data.status,
      dueDate: data.dueDate,
      imageUrl: data.imageUrl,
      width: data.width,
      height: data.height,
      dataAiHint: data.dataAiHint,
      copies: data.copies,
      available: data.available,
    } as Book);
  });
  return books;
}
