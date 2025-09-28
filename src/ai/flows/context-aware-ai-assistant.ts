'use server';
/**
 * @fileOverview An AI assistant that can generate code, refactor, and provide explanations using project-wide context.
 *
 * - contextAwareAIAssistant - A function that handles the AI assistant process.
 * - ContextAwareAIAssistantInput - The input type for the contextAwareAIAssistant function.
 * - ContextAwareAIAssistantOutput - The return type for the contextAwareAIAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContextAwareAIAssistantInputSchema = z.object({
  instruction: z.string().describe('The instruction for the AI assistant.'),
  fileContents: z.record(z.string()).describe('A map of file paths to their contents in the virtual file system.'),
  currentFilePath: z.string().optional().describe('The currently open file path.'),
});
export type ContextAwareAIAssistantInput = z.infer<typeof ContextAwareAIAssistantInputSchema>;

const ContextAwareAIAssistantOutputSchema = z.object({
  response: z.string().describe('The response from the AI assistant.'),
});
export type ContextAwareAIAssistantOutput = z.infer<typeof ContextAwareAIAssistantOutputSchema>;

export async function contextAwareAIAssistant(input: ContextAwareAIAssistantInput): Promise<ContextAwareAIAssistantOutput> {
  return contextAwareAIAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contextAwareAIAssistantPrompt',
  input: {schema: ContextAwareAIAssistantInputSchema},
  output: {schema: ContextAwareAIAssistantOutputSchema},
  prompt: `You are Synapse IDE's AI Assistant, a dedicated and precise coding companion. Your personality is analytical, patient, encouraging, and knowledgeable. Your goal is to be a reliable technical partner, valuing elegant, efficient, and well-structured solutions.

Your communication style is clear, professional, and approachable. You should use programming terminology (like "syntax," "refactor," "async/await") naturally, but also break down jargon for clarity when explaining complex concepts.

Core Directives:
1. Provide accurate, functional, and efficient code solutions.
2. Assist in debugging with clear, step-by-step guidance.
3. Explain complex programming concepts, patterns, or language features in an understandable manner.
4. Adhere to best practices for code readability, maintainability, and security.
5. Suggest refactoring or optimization opportunities when appropriate.
6. When providing code, also provide a brief, clear explanation of how it works and why it's a good solution.

You have access to the user's current project context:
{{#each fileContents as |content filePath|}}
File path: {{{filePath}}}
File contents:
{{content}}
{{/each}}

The user is currently viewing: {{{currentFilePath}}}

The user's instruction is:
"{{{instruction}}}"

Based on the context and your directives, provide a helpful response.
`,
});

const contextAwareAIAssistantFlow = ai.defineFlow(
  {
    name: 'contextAwareAIAssistantFlow',
    inputSchema: ContextAwareAIAssistantInputSchema,
    outputSchema: ContextAwareAIAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {response: output!.response};
  }
);
