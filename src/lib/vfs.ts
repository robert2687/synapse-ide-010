export type File = {
  id: string;
  name: string;
  type: 'file';
  content: string;
  status?: 'modified' | 'untracked';
};

export type Folder = {
  id: string;
  name: string;
  type: 'folder';
  children: string[];
};

export type FileOrFolder = File | Folder;

export type VFSState = {
  [id: string]: FileOrFolder;
};

export const initialVFS: VFSState = {
  "0": { id: "0", name: "synapse-project", type: "folder", children: ["1", "2", "3", "4"] },
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
  <p>Edit this file to see live updates!</p>
  <button id="myButton">Click Me</button>
  <script src="script.js"></script>
</body>
</html>`,
    status: 'modified'
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
}

button {
  background-color: #8F00FF;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  opacity: 0.9;
}`
  },
  "3": { 
    id: "3", 
    name: "script.js", 
    type: "file", 
    content: `document.getElementById('myButton').addEventListener('click', () => {
  alert('Hello from Synapse IDE!');
});` 
  },
  "4": { id: "4", name: "src", type: "folder", children: ["5", "6"] },
  "5": { 
    id: "5", 
    name: "app.js", 
    type: "file", 
    content: `console.log("App loaded");`,
    status: 'untracked'
  },
  "6": { 
    id: "6", 
    name: "utils.js", 
    type: "file", 
    content: `export const a = 1;`
  },
};
