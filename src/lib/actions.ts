"use server";

import { contextAwareAIAssistant, type ContextAwareAIAssistantInput } from "@/ai/flows/context-aware-ai-assistant";

export async function handleAiQuery(instruction: string, fileContents: Record<string, string>, currentFilePath?: string) {
    try {
        const input: ContextAwareAIAssistantInput = {
            instruction,
            fileContents,
            currentFilePath,
        };
        const response = await contextAwareAIAssistant(input);
        return response;
    } catch (error) {
        console.error("Error in handleAiQuery:", error);
        throw new Error("Failed to get response from AI assistant.");
    }
}
