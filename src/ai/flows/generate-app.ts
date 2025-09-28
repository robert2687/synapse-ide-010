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
Your task is to generate the complete file structure and content for this application based on their prompt.

User Prompt:
"{{{prompt}}}"

Please generate a complete, self-contained, and functional frontend application.
The application should consist of at least:
1.  An 'index.html' file as the main entry point.
2.  A 'style.css' file for styling.
3.  A 'script.js' file for any interactivity.

You must return the file structure in the virtual file system (VFS) format.
The VFS object is a map where keys are IDs and values are file or folder objects.
- The root folder must have an ID of "0" and be named "synapse-project".
- All other files and folders should be children of this root folder.
- IDs must be unique strings.
- Files should have a 'type' of 'file' and 'content'.
- Folders should have a 'type' of 'folder' and a 'children' array of IDs.
- Ensure all file paths and references (like in <link> or <script> tags) are correct and relative.
- The generated code should be modern, clean, and follow best practices.
- Provide some basic but visually appealing styling in the CSS.
- If the prompt implies interactivity, implement it in the JavaScript file.
- Do not add any comments to the code.
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
