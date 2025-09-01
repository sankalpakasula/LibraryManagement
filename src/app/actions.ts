'use server';

import { recommendBooks } from '@/ai/flows/recommend-books';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

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
    path: ['confirmPassword'], // path of error
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
