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
    const existingUser = await db.collection('users').findOne({ email });

    if (existingUser) {
      return {
        errors: { email: ['A user with this email already exists.'] },
        message: 'Signup failed.',
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection('users').insertOne({
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
  errors?: {
    email?: string[];
    password?: string[];
  };
};

export async function loginUser(prevState: LoginState, formData: FormData) {
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
    
    // This is a conceptual representation. In a real app, you would use a secure session management solution.
    // For this example, we'll redirect with a user ID, but this is NOT secure.
    redirect(`/my-books?userId=${user._id.toString()}`);

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
      genre,
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
    const book = await db.collection('books').findOne({ _id: new ObjectId(bookId) });

    if (!book || book.available <= 0) {
      throw new Error("Book is not available for borrowing.");
    }
    
    const newAvailable = book.available - 1;
    const newStatus = newAvailable > 0 ? 'Available' : 'Checked Out';

    await db.collection('books').updateOne(
      { _id: new ObjectId(bookId) },
      { $set: { available: newAvailable, status: newStatus, borrowedBy: new ObjectId(userId) } }
    );
    
    revalidatePath('/');
    revalidatePath('/dashboard');
    revalidatePath('/my-books');
  } catch (e) {
    console.error("Error borrowing book:", e);
    // In a real app, you'd return a proper error state.
  }
}

export async function returnBook(bookId: string) {
  try {
    const { db } = await connectToDatabase();
    const book = await db.collection('books').findOne({ _id: new ObjectId(bookId) });

    if (!book || book.available >= book.copies) {
      throw new Error("Cannot return a book that is already fully stocked.");
    }

    const newAvailable = book.available + 1;
    const newStatus = newAvailable > 0 ? 'Available' : 'Checked Out';

    await db.collection('books').updateOne(
      { _id: new ObjectId(bookId) },
      { $set: { available: newAvailable, status: newStatus, borrowedBy: null } }
    );
    revalidatePath('/');
    revalidatePath('/dashboard');
    revalidatePath('/my-books');
  } catch (e) {
    console.error("Error returning book:", e);
  }
}

export async function reserveBook(bookId: string, userId: string) {
  try {
    const { db } = await connectToDatabase();
    const book = await db.collection('books').findOne({ _id: new ObjectId(bookId) });

    if (!book || book.available > 0) {
      throw new Error("Cannot reserve a book that is currently available.");
    }

    // In a real system, reservations would be a queue. For now, we'll just mark it.
    await db.collection('books').updateOne(
      { _id: new ObjectId(bookId) },
      { $set: { status: 'Reserved', borrowedBy: new ObjectId(userId) } }
    );
    revalidatePath('/');
    revalidatePath('/dashboard');
    revalidatePath('/my-books');
  } catch (e) {
    console.error("Error reserving book:", e);
  }
}
