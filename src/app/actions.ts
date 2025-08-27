'use server';

import { recommendBooks } from '@/ai/flows/recommend-books';
import { z } from 'zod';

const recommendationSchema = z.object({
  borrowingHistory: z.string().min(10, { message: 'Please describe your borrowing history in at least 10 characters.' }),
  readingPreferences: z.string().min(10, { message: 'Please describe your reading preferences in at least 10 characters.' }),
});

export type State = {
  message?: string;
  recommendations?: string;
  errors?: {
    borrowingHistory?: string[];
    readingPreferences?: string[];
  };
}

export async function getRecommendations(prevState: State, formData: FormData): Promise<State> {
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
