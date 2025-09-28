"use client";

import { useCallback, useReducer, useState } from "react";
import type { FileOrFolder, VFSState } from "@/lib/vfs";
import { initialVFS } from "@/lib/vfs";
import FileExplorer from "@/components/ide/file-explorer";
import EditorPanel from "@/components/ide/editor-panel";
import LivePreview from "@/components/ide/live-preview";
import AiAssistant from "@/components/ide/ai-assistant";
import GitPanel from "@/components/ide/git-panel";
import Panel from "@/components/ide/panel";
import { Bot, FolderTree, GitMerge, PanelRightOpen } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  return (
    <main className="h-screen bg-background text-foreground overflow-hidden">
       <ResizablePanelGroup direction="horizontal" className="w-full h-full">
        <ResizablePanel defaultSize={20} minSize={15}>
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
        <ResizablePanel defaultSize={50} minSize={30}>
           <EditorPanel
                openFiles={openFiles}
                activeFile={activeFile}
                onSelectTab={setActiveFileId}
                onCloseTab={handleCloseTab}
                onContentChange={handleContentChange}
            />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={30} minSize={20}>
           <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={50} minSize={20}>
                <LivePreview vfs={vfs} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50} minSize={20}>
               <Panel title="AI Assistant" icon={<Bot />} className="h-full">
                <AiAssistant vfs={vfs} activeFile={activeFile} />
              </Panel>
            </ResizablePanel>
           </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
