'use server';

import { generateApp, type GenerateAppInput, type GenerateAppOutput } from '@/ai/flows/generate-app';
import type { VFSState } from './vfs';


export type HandleAiQueryOutput =
  | { type: 'vfs'; data: GenerateAppOutput }
  | { type: 'error'; error: string };

export async function handleAiQuery(
  instruction: string,
): Promise<HandleAiQueryOutput> {
  try {
    const input: GenerateAppInput = { prompt: instruction };
    const response = await generateApp(input);
    return { type: 'vfs', data: response };
  } catch (error) {
    console.error('Error in handleAiQuery:', error);
    const message = error instanceof Error ? error.message : 'Failed to get response from AI assistant.';
    return { type: 'error', error: message };
  }
}
