
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
        borrowedBy: borrowedBy?.toString(),
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
        const userObjectId = new ObjectId(userId);

        const borrows = await db.collection('borrows').find({ userId: userObjectId }).toArray();
        const reserved = await db.collection('reservations').find({ userId: userObjectId }).toArray();
        const bookIds = [...borrows.map(b => b.bookId), ...reserved.map(r => r.bookId)];

        const books = await db
            .collection("books")
            .find({ _id: { $in: bookIds } })
            .sort({ title: 1 })
            .toArray();

        return books.map((book) => {
            const { _id, borrowedBy, ...rest } = book;
            return {
                id: _id.toString(),
                 borrowedBy: borrowedBy?.toString(),
                ...rest,
            } as unknown as Book;
        });
    } catch (error) {
        console.error("Error fetching user's books from MongoDB:", error);
        return [];
    }
}


export async function getBorrowsAndReservationsAction() {
    try {
        const { db } = await connectToDatabase();
        
        const borrows = await db.collection('borrows').find({}).toArray();
        const reservations = await db.collection('reservations').find({}).toArray();

        return {
            borrows: borrows.map(b => ({
                ...b,
                _id: b._id.toString(),
                bookId: b.bookId.toString(),
                userId: b.userId.toString()
            })),
            reservations: reservations.map(r => ({
                ...r,
                _id: r._id.toString(),
                bookId: r.bookId.toString(),
                userId: r.userId.toString()
            }))
        };

    } catch (error) {
        console.error("Error fetching borrow/reservation details:", error);
        return { borrows: [], reservations: [] };
    }
}
