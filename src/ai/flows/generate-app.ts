'use server';
/**
 * @fileOverview A flow for generating a full web application from a prompt.
 *
 * - generateApp - A function that handles the app generation process.
 */

import { ai } from '@/ai/genkit';
import {
  GenerateAppInputSchema,
  type GenerateAppInput,
  GenerateAppOutputSchema,
  type GenerateAppOutput,
} from '@/ai/schemas/generate-app-schemas';

export async function generateApp(input: GenerateAppInput): Promise<GenerateAppOutput> {
  return generateAppFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAppPrompt',
  input: { schema: GenerateAppInputSchema },
  output: { schema: GenerateAppOutputSchema },
  prompt: `You are an expert web developer. A user has requested to build a new web application.
Your task is to generate the file structure and content for this application based on their prompt.

User Prompt:
"{{{prompt}}}"

Please generate a simple "hello world" style web application. It should include an index.html, a style.css, and a script.js file.
You must return a flat array of file objects.
- Each file object should have a 'path' (e.g., "src/index.html") and 'content'.
- Do not add any comments to the code.
- Do not create any folders, just the files with their full paths.
`,
});

const generateAppFlow = ai.defineFlow(
  {
    name: 'generateAppFlow',
    inputSchema: GenerateAppInputSchema,
    outputSchema: GenerateAppOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
