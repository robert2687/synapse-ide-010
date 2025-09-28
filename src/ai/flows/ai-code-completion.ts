/**
 * @fileOverview AI code completion flow.
 *
 * - aiCodeCompletion - A function that handles the code completion process.
 * - AiCodeCompletionInput - The input type for the aiCodeCompletion function.
 * - AiCodeCompletionOutput - The return type for the aiCodeCompletion function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiCodeCompletionInputSchema = z.object({
  fileType: z.string().describe('The type of the current file (e.g., HTML, CSS, JS, TSX).'),
  codeContext: z.string().describe('The current code context in the editor.'),
  projectStructure: z.string().optional().describe('The structure of the project as a JSON string.'),
  otherOpenTabs: z.string().optional().describe('Content of other open files in the editor, as a JSON string.'),
});
export type AiCodeCompletionInput = z.infer<typeof AiCodeCompletionInputSchema>;

const AiCodeCompletionOutputSchema = z.object({
  codeSuggestion: z.string().describe('The suggested code completion.'),
});
export type AiCodeCompletionOutput = z.infer<typeof AiCodeCompletionOutputSchema>;

export async function aiCodeCompletion(input: AiCodeCompletionInput): Promise<AiCodeCompletionOutput> {
  return aiCodeCompletionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCodeCompletionPrompt',
  input: {schema: AiCodeCompletionInputSchema},
  output: {schema: AiCodeCompletionOutputSchema},
  prompt: `You are an AI code completion assistant for Synapse IDE. Your goal is to provide accurate, concise, and relevant code suggestions. Only return the code that should be inserted at the current cursor position. Do not add explanations or any text outside of the code block.

You have the following context:

Current File Type: {{{fileType}}}

Current Code Context (the user's cursor is at the end of this block):
\`\`\`{{{fileType}}}
{{{codeContext}}}
\`\`\`

Project Structure (if available):
{{{projectStructure}}}

Other Open Tabs (if available):
{{{otherOpenTabs}}}

Based on the context, provide the most likely code completion.`,
});

const aiCodeCompletionFlow = ai.defineFlow(
  {
    name: 'aiCodeCompletionFlow',
    inputSchema: AiCodeCompletionInputSchema,
    outputSchema: AiCodeCompletionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
