'use server';

/**
 * @fileOverview A flow to generate "Did You Mean" suggestions for user queries using Gemini.
 *
 * - didYouMeanSuggestions - A function that generates related or alternative questions based on a user's input.
 * - DidYouMeanSuggestionsInput - The input type for the didYouMeanSuggestions function.
 * - DidYouMeanSuggestionsOutput - The return type for the didYouMeanSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DidYouMeanSuggestionsInputSchema = z.object({
  userQuery: z.string().describe("The user's original question."),
});
export type DidYouMeanSuggestionsInput = z.infer<typeof DidYouMeanSuggestionsInputSchema>;

const DidYouMeanSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('An array of suggested alternative questions.'),
});
export type DidYouMeanSuggestionsOutput = z.infer<typeof DidYouMeanSuggestionsOutputSchema>;

export async function didYouMeanSuggestions(input: DidYouMeanSuggestionsInput): Promise<DidYouMeanSuggestionsOutput> {
  return didYouMeanSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'didYouMeanSuggestionsPrompt',
  input: {schema: DidYouMeanSuggestionsInputSchema},
  output: {schema: DidYouMeanSuggestionsOutputSchema},
  prompt: `Based on the question: '{{userQuery}}', suggest 2 related or alternative ways to ask this question. Return the suggestions as a JSON array of strings.`,
});

const didYouMeanSuggestionsFlow = ai.defineFlow(
  {
    name: 'didYouMeanSuggestionsFlow',
    inputSchema: DidYouMeanSuggestionsInputSchema,
    outputSchema: DidYouMeanSuggestionsOutputSchema,
  },
  async (input, streamingCallback) => {
    let retries = 3;
    let lastError: any;
    while (retries > 0) {
      try {
        const {output} = await prompt(input);
        return output!;
      } catch (e) {
        lastError = e;
        console.log(`didYouMeanSuggestionsFlow failed, retrying...`, e);
        retries--;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    throw lastError;
  }
);
