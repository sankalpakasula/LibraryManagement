'use server';
/**
 * @fileOverview A book recommendation AI agent.
 *
 * - recommendBooks - A function that handles the book recommendation process.
 * - RecommendBooksInput - The input type for the recommendBooks function.
 * - RecommendBooksOutput - The return type for the recommendBooks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const RecommendBooksInputSchema = z.object({
  readingPreferences: z
    .string()
    .describe("The user's reading preferences, favorite genres, or authors."),
});
export type RecommendBooksInput = z.infer<typeof RecommendBooksInputSchema>;

const BookRecommendationSchema = z.object({
  title: z.string().describe('The title of the recommended book.'),
  author: z.string().describe('The author of the recommended book.'),
  reason: z
    .string()
    .describe('A brief, compelling reason why the user might like this book based on their preferences.'),
});

const RecommendBooksOutputSchema = z.object({
  recommendations: z
    .array(BookRecommendationSchema)
    .describe('A list of 3-5 book recommendations.'),
});
export type RecommendBooksOutput = z.infer<typeof RecommendBooksOutputSchema>;

export async function recommendBooks(
  input: RecommendBooksInput
): Promise<RecommendBooksOutput> {
  const llmResponse = await recommendBooksFlow(input);
  return llmResponse;
}

const recommendBooksFlow = ai.defineFlow(
  {
    name: 'recommendBooksFlow',
    inputSchema: RecommendBooksInputSchema,
    outputSchema: RecommendBooksOutputSchema,
  },
  async input => {
    const prompt = ai.definePrompt({
      name: 'recommendBooksPrompt',
      input: {schema: RecommendBooksInputSchema},
      output: {schema: RecommendBooksOutputSchema},
      prompt: `You are an expert librarian, a curator of literary journeys.
          A user has shared their reading preferences with you.
          Your task is to recommend 3-5 books that align with their tastes.
          For each book, provide the title, the author, and a compelling, one-sentence reason why this specific user would enjoy it.
          Do not recommend books that are already in the library catalog.
          Here are the user's preferences: {{{readingPreferences}}}
          Return your recommendations in a structured JSON format.`,
    });

    const {output} = await prompt(input);
    if (!output) {
      throw new Error('No output from AI model');
    }
    return output;
  }
);
