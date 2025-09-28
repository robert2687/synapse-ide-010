"use client";

import { useCallback, useReducer, useState } from "react";
import type { FileOrFolder, VFSState } from "@/lib/vfs";
import { initialVFS } from "@/lib/vfs";
import FileExplorer from "@/components/ide/file-explorer";
import AiAssistant from "@/components/ide/ai-assistant";
import LivePreview from "@/components/ide/live-preview";
import { Bot, FolderTree, Code, Eye, GitBranch } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AgentsPanel from "@/components/ide/agents-panel";


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

  const handleVFSUpdate = useCallback((newVFS: VFSState) => {
    dispatch({ type: 'SET_VFS', payload: newVFS });
    const defaultFile = Object.values(newVFS).find(f => f.name === 'index.html');
    if (defaultFile) {
        setOpenFileIds([defaultFile.id]);
        setActiveFileId(defaultFile.id);
    } else {
        setOpenFileIds([]);
        setActiveFileId(null);
    }
  }, []);

  const handleFileSelect = useCallback((id: string) => {
    const file = vfs[id];
    if (file.type === "file") {
      setActiveFileId(id);
      if (!openFileIds.includes(id)) {
        setOpenFileIds((prev) => [...prev, id]);
      }
    }
  }, [vfs, openFileIds]);

  
  const handleContentChange = useCallback((id: string, content: string) => {
    dispatch({ type: "UPDATE_FILE_CONTENT", payload: { id, content } });
  }, []);

  const openFiles = openFileIds.map(id => vfs[id]).filter((f): f is FileOrFolder => f !== undefined);

  return (
    <main className="h-screen bg-background text-foreground overflow-hidden">
       <ResizablePanelGroup direction="horizontal" className="w-full h-full">
        <ResizablePanel defaultSize={20} minSize={15}>
            <Tabs defaultValue="files" className="h-full flex flex-col">
                <TabsList className="m-2">
                    <TabsTrigger value="files" className="flex-1 gap-2"><FolderTree/> Files</TabsTrigger>
                    <TabsTrigger value="agents" className="flex-1 gap-2"><GitBranch/> Agents</TabsTrigger>
                </TabsList>
                <TabsContent value="files" className="flex-grow">
                    <FileExplorer
                        vfs={vfs}
                        onFileSelect={handleFileSelect}
                        activeFileId={activeFileId}
                    />
                </TabsContent>
                <TabsContent value="agents" className="flex-grow">
                    <AgentsPanel />
                </TabsContent>
            </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={80} minSize={30}>
            <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={60} minSize={20}>
                     <div className="p-2 h-full flex flex-col">
                        <h2 className="text-lg font-semibold flex items-center gap-2 p-2"><Bot/> AI Assistant</h2>
                        <AiAssistant vfs={vfs} activeFile={activeFile} onVFSUpdate={handleVFSUpdate} />
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={40} minSize={20}>
                    <Tabs defaultValue="preview" className="h-full flex flex-col">
                        <TabsList className="m-2">
                            <TabsTrigger value="preview" className="flex-1 gap-2"><Eye/> Preview</TabsTrigger>
                        </TabsList>
                        <TabsContent value="preview" className="flex-grow">
                            <LivePreview vfs={vfs} />
                        </TabsContent>
                    </Tabs>
                </ResizablePanel>
            </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
