
'use server';

import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongodb';
import { revalidatePath } from 'next/cache';
import type { Book } from '@/components/book-item';
import { seedDatabase } from './data';
import { ObjectId } from 'mongodb';

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
      const { _id, borrowedBy, ...rest } = book;
      return {
        id: _id.toString(),
        borrowedBy: borrowedBy ? borrowedBy.toString() : null,
        ...rest,
      } as unknown as Book;
    });
  } catch (error) {
    console.error("Error fetching books from MongoDB:", error);
    return [];
  }
}

export async function getMyBooksAction(userId: string): Promise<Book[]> {
    if (!userId) return [];
    try {
        const { db } = await connectToDatabase();
        const books = await db
            .collection("books")
            .find({ borrowedBy: new ObjectId(userId) })
            .sort({ title: 1 })
            .toArray();

        return books.map((book) => {
            const { _id, borrowedBy, ...rest } = book;
            return {
                id: _id.toString(),
                borrowedBy: borrowedBy ? borrowedBy.toString() : null,
                ...rest,
            } as unknown as Book;
        });
    } catch (error) {
        console.error("Error fetching user's books from MongoDB:", error);
        return [];
    }
}
