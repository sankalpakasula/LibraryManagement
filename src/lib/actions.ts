'use server';

import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongodb';
import { revalidatePath } from 'next/cache';
import type { Book } from '@/components/book-item';
import { seedDatabase } from './data';

const addBookSchema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
  author: z.string().min(1, { message: 'Author is required.' }),
  copies: z.coerce.number().int().min(1, { message: 'Copies must be at least 1.' }),
});

export type AddBookState = {
  message?: string;
  errors?: {
    title?: string[];
    author?: string[];
    copies?: string[];
  };
}

export async function addBook(prevState: AddBookState, formData: FormData): Promise<AddBookState> {
  const validatedFields = addBookSchema.safeParse({
    title: formData.get('title'),
    author: formData.get('author'),
    copies: formData.get('copies'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check the fields.',
    };
  }
  
  const { title, author, copies } = validatedFields.data;

  try {
    const { db } = await connectToDatabase();
    
    await db.collection('books').insertOne({
      title,
      author,
      copies,
      available: copies,
      status: 'Available',
      imageUrl: `https://picsum.photos/seed/${encodeURIComponent(title)}/300/400`,
      width: 300,
      height: 400,
      dataAiHint: 'book cover',
      dueDate: null,
      genre: 'Uncategorized'
    });

    revalidatePath('/dashboard');
    revalidatePath('/');
    return { message: 'Book added successfully!' };

  } catch (e) {
    console.error(e);
    return { message: 'An unexpected error occurred while adding the book.' };
  }
}

export async function getBooksAction(): Promise<Book[]> {
  try {
    await seedDatabase();
    const { db } = await connectToDatabase();
    const books = await db
      .collection("books")
      .find({})
      .sort({ title: 1 })
      .toArray();

    return books.map((book) => {
      const { _id, ...rest } = book;
      return {
        id: _id.toString(),
        ...rest,
      } as unknown as Book;
    });
  } catch (error) {
    console.error("Error fetching books from MongoDB:", error);
    return [];
  }
}
