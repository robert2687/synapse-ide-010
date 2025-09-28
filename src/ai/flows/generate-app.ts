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
  prompt: `You are an expert full-stack web developer specializing in Next.js and Tailwind CSS. A user has requested to build a new web application.
Your task is to generate the complete file structure and content for this application based on their prompt.

User Prompt:
"{{{prompt}}}"

Please generate a complete, self-contained, and functional full-stack application using the Next.js App Router.
The application should include:
1.  React components for the user interface, placed in the 'src/app/' directory. Use server components by default.
2.  Backend logic as API route handlers in the 'src/app/api/' directory if the app requires data fetching or mutations.
3.  Styling using Tailwind CSS classes directly in the JSX. Do not generate separate CSS files.
4.  All necessary files for a basic Next.js project structure.

Styling Guidelines:
- Use Tailwind CSS classes directly in the components for all styling.
- For form input fields (text, password, email, etc.), apply modern styling: clear borders, adequate padding, and distinct hover/focus states (e.g., a subtle ring or border color change).
- For interactive elements like buttons and links, add subtle hover animations. For example, a slight scale change ('hover:scale-105'), a color shift, or a smooth background transition ('transition-colors duration-300'). These should be tasteful and not detract from usability.

You must return the file structure in the virtual file system (VFS) format.
The VFS object is a map where keys are IDs and values are file or folder objects.
- The root folder must have an ID of "0" and be named "synapse-project".
- All other files and folders should be children of this root folder.
- IDs must be unique strings.
- Files should have a 'type' of 'file' and 'content'.
- Folders should have a 'type' of 'folder' and a 'children' array of IDs.
- The generated code should be modern, clean, and follow best practices for Next.js development.
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
