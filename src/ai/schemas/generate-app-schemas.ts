/**
 * @fileOverview Schemas and types for the generateApp flow.
 */

import { z } from 'zod';
import { VFSStateSchema } from '@/lib/vfs';

export const GenerateAppInputSchema = z.object({
  prompt: z.string().describe('A natural language prompt describing the application to build.'),
});
export type GenerateAppInput = z.infer<typeof GenerateAppInputSchema>;

export const GenerateAppOutputSchema = z.object({
  vfs: VFSStateSchema.describe('The virtual file system state representing the generated application.'),
});
export type GenerateAppOutput = z.infer<typeof GenerateAppOutputSchema>;
