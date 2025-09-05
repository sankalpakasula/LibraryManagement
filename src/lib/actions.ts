
'use server';

import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongodb';
import { revalidatePath } from 'next/cache';
import type { Book } from '@/components/book-item';
import { seedDatabase } from './data';
import { ObjectId } from 'mongodb';

type User = {
    id: string;
    userId: string;
    name: string;
    email: string;
}

export async function getUsersAction(): Promise<User[]> {
    try {
        const { db } = await connectToDatabase();
        const users = await db.collection("users").find({}).toArray();

        return users.map((user) => ({
            id: user._id.toString(),
            userId: user.userId,
            name: user.name,
            email: user.email,
        }));
    } catch (error) {
        console.error("Error fetching users from MongoDB:", error);
        return [];
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
        const user = await db.collection('users').findOne({ userId: userId });
        if (!user) return [];
        
        const userObjectId = user._id;

        const borrows = await db.collection('borrows').find({ userId: userObjectId }).toArray();
        const reserved = await db.collection('reservations').find({ userId: userObjectId }).toArray();
        const bookIds = [...borrows.map(b => b.bookId), ...reserved.map(r => r.bookId)];

        if (bookIds.length === 0) return [];

        const books = await db
            .collection("books")
            .find({ _id: { $in: bookIds } })
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

    