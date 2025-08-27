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
    .describe('The user\u2019s past borrowing history, including titles and authors.'),
  readingPreferences: z
    .string()
    .describe('The user\u2019s reading preferences, such as genres and authors they like.'),
});
export type RecommendBooksInput = z.infer<typeof RecommendBooksInputSchema>;

const RecommendBooksOutputSchema = z.object({
  recommendations: z
    .string()
    .describe('A list of recommended books based on the user\u2019s history and preferences.'),
});
export type RecommendBooksOutput = z.infer<typeof RecommendBooksOutputSchema>;

export async function recommendBooks(input: RecommendBooksInput): Promise<RecommendBooksOutput> {
  return recommendBooksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendBooksPrompt',
  input: {schema: RecommendBooksInputSchema},
  output: {schema: RecommendBooksOutputSchema},
  prompt: `Based on the user's borrowing history and reading preferences, recommend some books they might enjoy.

Borrowing History: {{{borrowingHistory}}}
Reading Preferences: {{{readingPreferences}}}

Recommendations:`,
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
