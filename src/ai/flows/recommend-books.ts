
'use server';

/**
 * @fileOverview Provides personalized book recommendations based on user history and preferences.
 *
 * - recommendBooks - A function to generate book recommendations.
 * - RecommendBooksInput - The input type for the recommendBooks function.
 * - RecommendBooksOutput - The return type for the recommendBooks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendBooksInputSchema = z.object({
  borrowingHistory: z
    .string()
    .describe('The user’s past borrowing history, including titles and authors.'),
  readingPreferences: z
    .string()
    .describe('The user’s reading preferences, such as genres and authors they like.'),
});
export type RecommendBooksInput = z.infer<typeof RecommendBooksInputSchema>;

const BookRecommendationSchema = z.object({
  title: z.string().describe('The title of the recommended book.'),
  author: z.string().describe('The author of the recommended book.'),
  reason: z.string().describe('A brief reason for the recommendation.')
});

const RecommendBooksOutputSchema = z.object({
  recommendations: z
    .array(BookRecommendationSchema)
    .describe('A list of recommended books based on the user’s history and preferences.'),
});
export type RecommendBooksOutput = z.infer<typeof RecommendBooksOutputSchema>;

export async function recommendBooks(input: RecommendBooksInput): Promise<RecommendBooksOutput> {
  return recommendBooksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendBooksPrompt',
  input: {schema: RecommendBooksInputSchema},
  output: {schema: RecommendBooksOutputSchema},
  prompt: `You are a helpful and knowledgeable librarian at the LibroSmart library. Your goal is to provide excellent, personalized book recommendations.

Based on the user's borrowing history and reading preferences below, please suggest exactly 3 books they might enjoy. For each book, provide the title, author, and a short, compelling reason for the recommendation.

Borrowing History:
{{{borrowingHistory}}}

Reading Preferences:
{{{readingPreferences}}}
`,
});

const recommendBooksFlow = ai.defineFlow(
  {
    name: 'recommendBooksFlow',
    inputSchema: RecommendBooksInputSchema,
    outputSchema: RecommendBooksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
