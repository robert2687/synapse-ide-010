"use client";

import { useCallback, useReducer, useState } from "react";
import type { FileOrFolder, VFSState } from "@/lib/vfs";
import { initialVFS } from "@/lib/vfs";
import FileExplorer from "@/components/ide/file-explorer";
import LivePreview from "@/components/ide/live-preview";
import AiAssistant from "@/components/ide/ai-assistant";
import GitPanel from "@/components/ide/git-panel";
import { Bot, FolderTree, GitMerge, Code, Eye } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FileIcon } from "@/components/icons";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";


type VFSAction =
  | { type: "UPDATE_FILE_CONTENT"; payload: { id: string; content: string } }
  | { type: "SET_VFS"; payload: VFSState };

function vfsReducer(state: VFSState, action: VFSAction): VFSState {
  switch (action.type) {
    case "UPDATE_FILE_CONTENT": {
      const { id, content } = action.payload;
      const newState = { ...state };
      if (newState[id] && newState[id].type === 'file') {
        (newState[id] as Extract<FileOrFolder, { type: 'file' }>).content = content;
      }
      return newState;
    }
    case "SET_VFS":
      return action.payload;
    default:
      return state;
  }
}

export default function SynapseIDEPage() {
  const [vfs, dispatch] = useReducer(vfsReducer, initialVFS);
  const [activeFileId, setActiveFileId] = useState<string | null>("1"); // index.html
  const [openFileIds, setOpenFileIds] = useState<string[]>(["1"]);

  const activeFile = activeFileId ? vfs[activeFileId] : null;

  const handleFileSelect = useCallback((id: string) => {
    const file = vfs[id];
    if (file.type === "file") {
      setActiveFileId(id);
      if (!openFileIds.includes(id)) {
        setOpenFileIds((prev) => [...prev, id]);
      }
    }
  }, [vfs, openFileIds]);

  const handleCloseTab = (id: string) => {
    setOpenFileIds((prev) => prev.filter((fileId) => fileId !== id));
    if (activeFileId === id) {
      const remainingFiles = openFileIds.filter((fileId) => fileId !== id);
      setActiveFileId(remainingFiles.length > 0 ? remainingFiles[remainingFiles.length - 1] : null);
    }
  };
  
  const handleContentChange = useCallback((id: string, content: string) => {
    dispatch({ type: "UPDATE_FILE_CONTENT", payload: { id, content } });
  }, []);

  const openFiles = openFileIds.map(id => vfs[id]).filter((f): f is FileOrFolder => f !== undefined);

  const Editor = () => {
    if (!activeFile || activeFile.type !== "file") {
      return (
        <div className="h-full flex flex-col items-center justify-center bg-card text-muted-foreground p-4 text-center">
           <p className="text-lg font-medium">No file selected</p>
           <p className="text-sm">Select a file from the explorer to begin editing.</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col h-full bg-card">
        <div className="flex border-b bg-background/50 overflow-x-auto">
          {openFiles.map((file) => (
            <div
              key={file.id}
              onClick={() => setActiveFileId(file.id)}
              className={cn(
                "flex items-center gap-2 p-2 border-r cursor-pointer text-sm whitespace-nowrap flex-shrink-0",
                activeFile.id === file.id
                  ? "bg-card border-b-2 border-b-primary -mb-px"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <FileIcon filename={file.name} className="h-4 w-4" />
              <span className="truncate max-w-xs">{file.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseTab(file.id);
                }}
                className="p-0.5 rounded-full hover:bg-muted-foreground/20 flex-shrink-0"
                aria-label={`Close file ${file.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        <Textarea
          key={activeFile.id}
          value={activeFile.content}
          onChange={(e) => handleContentChange(activeFile.id, e.target.value)}
          className="w-full h-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none bg-card"
          aria-label={`Editing file ${activeFile.name}`}
        />
      </div>
    );
  }

  return (
    <main className="h-screen bg-background text-foreground overflow-hidden">
       <ResizablePanelGroup direction="horizontal" className="w-full h-full">
        <ResizablePanel defaultSize={25} minSize={20}>
          <Tabs defaultValue="files" className="h-full flex flex-col">
            <TabsList className="m-2">
              <TabsTrigger value="files" className="flex-1 gap-2"><FolderTree/> Files</TabsTrigger>
              <TabsTrigger value="git" className="flex-1 gap-2"><GitMerge/> Version Control</TabsTrigger>
            </TabsList>
            <TabsContent value="files" className="flex-grow">
               <FileExplorer
                  vfs={vfs}
                  onFileSelect={handleFileSelect}
                  activeFileId={activeFileId}
                />
            </TabsContent>
            <TabsContent value="git" className="flex-grow">
               <GitPanel />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75} minSize={30}>
          <Tabs defaultValue="editor" className="h-full flex flex-col">
              <TabsList className="m-2">
                <TabsTrigger value="editor" className="flex-1 gap-2"><Code/> Code</TabsTrigger>
                <TabsTrigger value="preview" className="flex-1 gap-2"><Eye/> Preview</TabsTrigger>
                <TabsTrigger value="assistant" className="flex-1 gap-2"><Bot/> AI Assistant</TabsTrigger>
              </TabsList>
              <TabsContent value="editor" className="flex-grow">
                <Editor />
              </TabsContent>
              <TabsContent value="preview" className="flex-grow">
                <LivePreview vfs={vfs} />
              </TabsContent>
              <TabsContent value="assistant" className="flex-grow">
                <AiAssistant vfs={vfs} activeFile={activeFile} />
              </TabsContent>
            </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
