"use server";

import { contextAwareAIAssistant, type ContextAwareAIAssistantInput, type ContextAwareAIAssistantOutput } from "@/ai/flows/context-aware-ai-assistant";

export async function handleAiQuery(instruction: string, fileContents: Record<string, string>, currentFilePath?: string): Promise<ContextAwareAIAssistantOutput | { error: string }> {
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
        // Instead of throwing, return a structured error object
        return { error: "Failed to get response from AI assistant." };
    }
}
