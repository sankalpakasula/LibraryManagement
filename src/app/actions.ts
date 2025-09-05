
'use server';

import { recommendBooks } from '@/ai/flows/recommend-books';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';

const recommendationSchema = z.object({
  borrowingHistory: z.string().min(10, { message: 'Please describe your borrowing history in at least 10 characters.' }),
  readingPreferences: z.string().min(10, { message: 'Please describe your reading preferences in at least 10 characters.' }),
});

export type RecommendationState = {
  message?: string;
  recommendations?: string;
  errors?: {
    borrowingHistory?: string[];
    readingPreferences?: string[];
  };
}

export async function getRecommendations(prevState: RecommendationState, formData: FormData): Promise<RecommendationState> {
  const validatedFields = recommendationSchema.safeParse({
    borrowingHistory: formData.get('borrowingHistory'),
    readingPreferences: formData.get('readingPreferences'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check the fields.',
    };
  }
  
  try {
    const result = await recommendBooks(validatedFields.data);
    return { recommendations: result.recommendations, message: 'Here are your recommendations!' };
  } catch (e) {
    console.error(e);
    return { message: 'An unexpected error occurred while generating recommendations.' };
  }
}


const signupSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type SignupState = {
  message?: string;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
};

export async function signupUser(prevState: SignupState, formData: FormData): Promise<SignupState> {
  const validatedFields = signupSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check the fields.',
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return {
        errors: { email: ['A user with this email already exists.'] },
        message: 'Signup failed.',
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserId = new ObjectId();

    await usersCollection.insertOne({
      _id: newUserId,
      userId: newUserId.toString(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return { message: 'Signup successful! You can now log in.' };
  } catch (e) {
    console.error(e);
    return { message: 'An unexpected error occurred during signup.' };
  }
}

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export type LoginState = {
  message?: string;
  userId?: string;
  userName?: string;
  role?: 'admin' | 'user';
  errors?: {
    email?: string[];
    password?: string[];
  };
};

export async function loginUser(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const validatedFields = loginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check the fields.',
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return {
        errors: { email: ['No user found with this email.'] },
        message: 'Login failed.',
      };
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return {
        errors: { password: ['Invalid password.'] },
        message: 'Login failed.',
      };
    }
    
    const role = email === 'tatidheeraj@gmail.com' ? 'admin' : 'user';

    return {
      message: 'Login successful!',
      userId: user._id.toString(),
      userName: user.name,
      role: role,
    };

  } catch (e) {
    console.error(e);
    return { message: 'An unexpected error occurred during login.' };
  }
}

const addBookSchema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
  author: z.string().min(1, { message: 'Author is required.' }),
  copies: z.coerce.number().int().min(1, { message: 'Copies must be at least 1.' }),
  genre: z.string().min(1, { message: 'Genre is required.' }),
});

export type AddBookState = {
  message?: string;
  errors?: {
    title?: string[];
    author?: string[];
    copies?: string[];
    genre?: string[];
  };
}

export async function addBook(prevState: AddBookState, formData: FormData): Promise<AddBookState> {
  const validatedFields = addBookSchema.safeParse({
    title: formData.get('title'),
    author: formData.get('author'),
    copies: formData.get('copies'),
    genre: formData.get('genre'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check the fields.',
    };
  }
  
  const { title, author, copies, genre } = validatedFields.data;

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
      genre: genre || "Uncategorized",
      borrowedBy: null,
    });

    revalidatePath('/dashboard');
    revalidatePath('/');
    return { message: 'Book added successfully!' };

  } catch (e) {
    console.error(e);
    return { message: 'An unexpected error occurred while adding the book.' };
  }
}

export async function borrowBook(bookId: string, userId: string) {
  try {
    const { db } = await connectToDatabase();
    const bookObjectId = new ObjectId(bookId);
    const userObjectId = new ObjectId(userId);
    
    const book = await db.collection('books').findOne({ _id: bookObjectId });

    if (!book || book.available <= 0) {
      throw new Error("Book is not available for borrowing.");
    }
    
    // Check if any copy of this book is already borrowed by this user
    const userAlreadyHasBook = await db.collection('borrows').findOne({ 
      bookId: bookObjectId, 
      userId: userObjectId 
    });

    if (userAlreadyHasBook) {
      throw new Error("You have already borrowed a copy of this book.");
    }

    const newAvailable = book.available - 1;
    const newStatus = newAvailable > 0 ? 'Available' : 'Checked Out';

    // Update book collection
    await db.collection('books').updateOne(
      { _id: bookObjectId },
      { $set: { available: newAvailable, status: newStatus } }
    );
    
    // Create a record in a new 'borrows' collection
    await db.collection('borrows').insertOne({
      bookId: bookObjectId,
      userId: userObjectId,
      borrowedAt: new Date(),
    });
    
    revalidatePath('/');
    revalidatePath('/dashboard');
    revalidatePath('/my-books');
  } catch (e) {
    console.error("Error borrowing book:", e);
    // Propagate the specific error message
    throw new Error((e as Error).message);
  }
}

export async function returnBook(bookId: string, userId: string) {
  try {
    const { db } = await connectToDatabase();
    const bookObjectId = new ObjectId(bookId);
    const userObjectId = new ObjectId(userId);

    const book = await db.collection('books').findOne({ _id: bookObjectId });

    if (!book) {
      throw new Error("Book not found.");
    }

    // Check if there is a borrow record
    const borrowRecord = await db.collection('borrows').findOne({
      bookId: bookObjectId,
      userId: userObjectId,
    });
    
    if (!borrowRecord) {
      // This case might happen if data is inconsistent, but it's good to handle
      throw new Error("You don't seem to have this book borrowed.");
    }

    // Remove the borrow record
    await db.collection('borrows').deleteOne({ _id: borrowRecord._id });
    
    // Check for reservations to determine the new status
    const reservation = await db.collection('reservations').findOne({ bookId: bookObjectId }, { sort: { reservedAt: 1 } });
    
    if (reservation) {
      // If there was a reservation, assign the book to the reserving user
      // The available count doesn't change because it goes directly to the next person.
      await db.collection('borrows').insertOne({
        bookId: bookObjectId,
        userId: reservation.userId,
        borrowedAt: new Date(),
      });
      await db.collection('reservations').deleteOne({ _id: reservation._id });
      // The status remains 'Checked Out' or becomes 'Reserved' if there are more reservations
      const remainingReservations = await db.collection('reservations').countDocuments({ bookId: bookObjectId });
      await db.collection('books').updateOne(
        { _id: bookObjectId },
        { $set: { status: remainingReservations > 0 ? 'Reserved' : 'Checked Out' } }
      );
    } else {
       // If no reservation, the book becomes available
       await db.collection('books').updateOne(
        { _id: bookObjectId },
        { 
          $inc: { available: 1 },
          $set: { status: 'Available' }
        }
      );
    }
    
    revalidatePath('/');
    revalidatePath('/dashboard');
    revalidatePath('/my-books');
  } catch (e) {
    console.error("Error returning book:", e);
    throw new Error((e as Error).message);
  }
}


export async function reserveBook(bookId: string, userId: string) {
  try {
    const { db } = await connectToDatabase();
    const bookObjectId = new ObjectId(bookId);
    const userObjectId = new ObjectId(userId);
    
    const book = await db.collection('books').findOne({ _id: bookObjectId });

    if (!book) {
        throw new Error("Book not found.");
    }

    if (book.available > 0) {
      throw new Error("Cannot reserve a book that is currently available.");
    }

    // Check if user already has it borrowed or reserved
    const existingBorrow = await db.collection('borrows').findOne({ bookId: bookObjectId, userId: userObjectId });
    if(existingBorrow) {
        throw new Error("You have already borrowed this book.");
    }
    const existingReservation = await db.collection('reservations').findOne({ bookId: bookObjectId, userId: userObjectId });
     if(existingReservation) {
        throw new Error("You have already reserved this book.");
    }

    await db.collection('reservations').insertOne({
        bookId: bookObjectId,
        userId: userObjectId,
        reservedAt: new Date(),
    });

    await db.collection('books').updateOne(
      { _id: bookObjectId },
      { $set: { status: 'Reserved' } }
    );
    
    revalidatePath('/');
    revalidatePath('/dashboard');
    revalidatePath('/my-books');
  } catch (e) {
    console.error("Error reserving book:", e);
     throw new Error((e as Error).message);
  }
}


