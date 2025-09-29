
"use client";

import { useCallback, useReducer, useState } from "react";
import type { FileOrFolder, VFSState } from "@/lib/vfs";
import { initialVFS } from "@/lib/vfs";
import FileExplorer from "@/components/ide/file-explorer";
import LivePreview from "@/components/ide/live-preview";
import AiAssistant from "@/components/ide/ai-assistant";
import { Bot, FolderTree, Eye } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditorPanel from "@/components/ide/editor-panel";


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
  const [isGenerating, setIsGenerating] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);

  const activeFile = activeFileId ? vfs[activeFileId] : null;

  const handleVFSUpdate = useCallback((newVFS: VFSState) => {
    dispatch({ type: 'SET_VFS', payload: newVFS });
    const defaultFile = Object.values(newVFS).find(f => f.name === 'index.html' || f.name.endsWith('.tsx') || f.name.endsWith('.jsx'));
    if (defaultFile) {
        setOpenFileIds([defaultFile.id]);
        setActiveFileId(defaultFile.id);
    } else {
        const firstFile = Object.values(newVFS).find(f => f.type === 'file');
        if (firstFile) {
            setOpenFileIds([firstFile.id]);
            setActiveFileId(firstFile.id);
        } else {
            setOpenFileIds([]);
            setActiveFileId(null);
        }
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
  
  const handleFileContentChange = (id: string, content: string) => {
    dispatch({ type: 'UPDATE_FILE_CONTENT', payload: { id, content } });
  };
  
  const handleCloseTab = (id: string) => {
    setOpenFileIds(prev => prev.filter(fileId => fileId !== id));
    if (activeFileId === id) {
        if (openFileIds.length > 1) {
            const newActiveFileId = openFileIds.filter(fileId => fileId !== id)[0];
            setActiveFileId(newActiveFileId);
        } else {
            setActiveFileId(null);
        }
    }
  };

  const toggleZenMode = () => setIsZenMode(prev => !prev);

  if (isZenMode) {
    return (
      <main className="h-screen bg-background text-foreground overflow-hidden">
        <LivePreview vfs={vfs} onToggleZenMode={toggleZenMode} isZenMode={true} />
      </main>
    );
  }

  return (
    <main className="h-screen bg-background text-foreground overflow-hidden">
       <ResizablePanelGroup direction="horizontal" className="w-full h-full">
        <ResizablePanel defaultSize={20} minSize={10}>
            <Tabs defaultValue="files" className="h-full flex flex-col">
                <TabsList className="m-2">
                    <TabsTrigger value="files" className="flex-1 gap-2"><FolderTree/> Files</TabsTrigger>
                </TabsList>
                <TabsContent value="files" className="flex-grow">
                    <FileExplorer
                        vfs={vfs}
                        onFileSelect={handleFileSelect}
                        activeFileId={activeFileId}
                    />
                </TabsContent>
            </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={80} minSize={30}>
            <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={60} minSize={20}>
                     <EditorPanel
                        vfs={vfs}
                        openFileIds={openFileIds}
                        activeFileId={activeFileId}
                        onFileSelect={setActiveFileId}
                        onFileContentChange={handleFileContentChange}
                        onCloseTab={handleCloseTab}
                    />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={40} minSize={20}>
                    <ResizablePanelGroup direction="horizontal">
                        <ResizablePanel defaultSize={50} minSize={30}>
                            <Tabs defaultValue="preview" className="h-full flex flex-col">
                                <TabsList className="m-2">
                                    <TabsTrigger value="preview" className="flex-1 gap-2"><Eye/> Preview</TabsTrigger>
                                </TabsList>
                                <TabsContent value="preview" className="flex-grow">
                                    <LivePreview vfs={vfs} onToggleZenMode={toggleZenMode} isZenMode={false} />
                                </TabsContent>
                            </Tabs>
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={50} minSize={30}>
                           <Tabs defaultValue="assistant" className="h-full flex flex-col">
                                <TabsList className="m-2">
                                    <TabsTrigger value="assistant" className="flex-1 gap-2"><Bot/> AI Assistant</TabsTrigger>
                                </TabsList>
                                <TabsContent value="assistant" className="flex-grow">
                                     <AiAssistant
                                        vfs={vfs}
                                        activeFile={activeFile}
                                        onVFSUpdate={handleVFSUpdate}
                                        isGenerating={isGenerating}
                                        setIsGenerating={setIsGenerating}
                                    />
                                </TabsContent>
                            </Tabs>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
