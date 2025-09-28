'use server';

import {
  contextAwareAIAssistant,
  type ContextAwareAIAssistantInput,
  type ContextAwareAIAssistantOutput,
} from '@/ai/flows/context-aware-ai-assistant';
import { generateApp, type GenerateAppInput, type GenerateAppOutput } from '@/ai/flows/generate-app';

export type HandleAiQueryOutput =
  | { type: 'response'; data: ContextAwareAIAssistantOutput }
  | { type: 'vfs'; data: GenerateAppOutput }
  | { type: 'error'; error: string };

export async function handleAiQuery(
  instruction: string,
  fileContents: Record<string, string>,
  currentFilePath?: string
): Promise<HandleAiQueryOutput> {
  try {
    // Simple heuristic to decide which flow to use.
    const isAppGenRequest = /^(build|create|generate|make) (me )?an? app/i.test(instruction);

    if (isAppGenRequest) {
      const input: GenerateAppInput = { prompt: instruction };
      const response = await generateApp(input);
      return { type: 'vfs', data: response };
    }

    const input: ContextAwareAIAssistantInput = {
      instruction,
      fileContents,
      currentFilePath,
    };
    const response = await contextAwareAIAssistant(input);
    return { type: 'response', data: response };
  } catch (error) {
    console.error('Error in handleAiQuery:', error);
    const message = error instanceof Error ? error.message : 'Failed to get response from AI assistant.';
    return { type: 'error', error: message };
  }
}
