# **App Name**: Synapse IDE

## Core Features:

- AI Code Completion: Use Gemini API to provide intelligent, context-aware code suggestions. The tool provides more context to the Gemini API, such as the current file type and project structure.
- Virtual File System: Enable the creation, renaming, deletion, and loading of files within a sandboxed environment, and show the status of each file using appropriate iconography.
- Monaco Editor: Provide a robust code editor with syntax highlighting and auto-completion for a smooth coding experience.
- Live Preview: Render code in real-time within an iframe or WebContainer, providing instant feedback on changes. Support common file types.
- Git Simulation: Simulate Git functionality including commit history, diff viewer, branch management, and status indication for files in the VFS.
- UI Panels: Editor, File Explorer, Live Preview, AI Assistant, and Git panels featuring resizable/dockable UI.
- Context-Aware AI Assistant: Provide an AI assistant powered by the Gemini API to perform code generation, refactoring, and explanations using project-wide context.

## Style Guidelines:

- Primary color: Deep sky blue (#00BFFF) to convey intelligence and innovation.
- Background color: Light gray (#F0F0F0) for a clean, modern aesthetic.
- Accent color: Electric violet (#8F00FF) for interactive elements and highlights.
- Body and headline font: 'Inter', a grotesque-style sans-serif, for a modern and neutral look.
- Code font: 'Source Code Pro' for displaying code snippets.
- Use minimalist icons to represent file types and Git actions, using the accent color (#8F00FF) for active states.
- Panels should be resizable and dockable to allow developers to customize their workspace. Utilize a grid-based layout for responsive design.
- Subtle animations (e.g., panel transitions, loading indicators) to enhance user experience without being distracting.