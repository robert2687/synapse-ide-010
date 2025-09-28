import { z } from 'zod';

export const FileSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.literal('file'),
  content: z.string(),
  status: z.enum(['modified', 'untracked']).optional(),
});
export type File = z.infer<typeof FileSchema>;

export const FolderSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.literal('folder'),
  children: z.array(z.string()),
});
export type Folder = z.infer<typeof FolderSchema>;

export const FileOrFolderSchema = z.union([FileSchema, FolderSchema]);
export type FileOrFolder = z.infer<typeof FileOrFolderSchema>;

export const VFSStateSchema = z.record(FileOrFolderSchema);
export type VFSState = z.infer<typeof VFSStateSchema>;

export const initialVFS: VFSState = {
  "0": { id: "0", name: "synapse-project", type: "folder", children: ["1", "2", "3"] },
  "1": { 
    id: "1", 
    name: "index.html", 
    type: "file", 
    content: `<!DOCTYPE html>
<html>
<head>
  <title>Synapse Project</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Welcome to Synapse IDE</h1>
  <p>Edit this file to see live updates, or ask the AI to build a new app!</p>
  <script src="script.js"></script>
</body>
</html>`
  },
  "2": { 
    id: "2", 
    name: "style.css", 
    type: "file", 
    content: `body {
  font-family: sans-serif;
  background-color: #f0f0f0;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin: 0;
}

h1 {
  color: #00BFFF;
}`
  },
  "3": { 
    id: "3", 
    name: "script.js", 
    type: "file", 
    content: `console.log("Welcome to Synapse!");` 
  },
};
