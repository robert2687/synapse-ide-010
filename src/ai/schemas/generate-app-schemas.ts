/**
 * @fileOverview Schemas and types for the generateApp flow.
 */

import { z } from 'zod';

export const GenerateAppInputSchema = z.object({
  prompt: z.string().describe('A natural language prompt describing the application to build.'),
});
export type GenerateAppInput = z.infer<typeof GenerateAppInputSchema>;


const GeneratedFileSchema = z.object({
    path: z.string().describe('The full path of the file, including the filename (e.g., "src/app.js").'),
    content: z.string().describe('The complete source code or content of the file.'),
});

export const GenerateAppOutputSchema = z.object({
  files: z.array(GeneratedFileSchema).describe('An array of files that make up the application.'),
});
export type GenerateAppOutput = z.infer<typeof GenerateAppOutputSchema>;
