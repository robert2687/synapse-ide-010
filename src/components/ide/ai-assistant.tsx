
"use client";

import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { handleAiQuery } from "@/lib/actions";
import type { FileOrFolder, VFSState, Folder, File } from "@/lib/vfs";
import { Bot, Send, User, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { GenerateAppOutput } from "@/ai/schemas/generate-app-schemas";

type Message = {
  role: "user" | "assistant";
  content: string;
};

interface AiAssistantProps {
  vfs: VFSState;
  activeFile: FileOrFolder | null;
  onVFSUpdate: (newVFS: VFSState) => void;
  isGenerating: boolean;
  setIsGenerating: Dispatch<SetStateAction<boolean>>;
}

function convertToVFS(generatedApp: GenerateAppOutput): VFSState {
    const vfs: VFSState = {
        "0": { id: "0", name: "synapse-project", type: "folder", children: [] }
    };
    let fileIdCounter = 1;

    generatedApp.files.forEach(file => {
        const pathParts = file.path.split('/').filter(p => p);
        let currentParentId = "0";

        pathParts.forEach((part, index) => {
            const isLastPart = index === pathParts.length - 1;
            
            let currentParent = vfs[currentParentId] as Folder;
            let existingChildId = currentParent.children.find(childId => vfs[childId]?.name === part);

            if (existingChildId) {
                if (isLastPart) { // This is a file, but a folder with same name exists
                     console.error("Path conflict: File and folder with the same name", file.path);
                } else {
                    currentParentId = existingChildId;
                }
            } else {
                 if (isLastPart) { // It's a file
                    const newFileId = String(fileIdCounter++);
                    const newFile: File = {
                        id: newFileId,
                        name: part,
                        type: 'file',
                        content: file.content
                    };
                    vfs[newFileId] = newFile;
                    currentParent.children.push(newFileId);
                } else { // It's a directory
                    const newFolderId = String(fileIdCounter++);
                    const newFolder: Folder = {
                        id: newFolderId,
                        name: part,
                        type: 'folder',
                        children: []
                    };
                    vfs[newFolderId] = newFolder;
                    currentParent.children.push(newFolderId);
                    currentParentId = newFolderId;
                }
            }
        });
    });

    if (generatedApp.files.length > 0 && Object.keys(vfs).length === 1) {
        // Handle case where files might be in root, e.g. "index.html"
        const root = vfs["0"] as Folder;
        generatedApp.files.forEach(file => {
            if (!file.path.includes('/')) {
                const newFileId = String(fileIdCounter++);
                const newFile: File = {
                    id: newFileId,
                    name: file.path,
                    type: 'file',
                    content: file.content
                };
                vfs[newFileId] = newFile;
                root.children.push(newFileId);
            }
        });
    }

    // Default to a simple hello world if generation is empty for some reason
    if (Object.keys(vfs).length <= 1) {
        vfs['1'] = { id: '1', name: 'index.html', type: 'file', content: '<h1>Hello World</h1>' };
        (vfs['0'] as Folder).children.push('1');
    }


    return vfs;
}


export default function AiAssistant({ vfs, activeFile, onVFSUpdate, isGenerating, setIsGenerating }: AiAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsGenerating(true);

    try {
      const result = await handleAiQuery(currentInput);
      
      if(result.type === 'error') {
        throw new Error(result.error);
      } else if (result.type === 'vfs') {
        const newVFS = convertToVFS(result.data);
        onVFSUpdate(newVFS);
        const assistantMessage: Message = { role: "assistant", content: `I've generated the file structure for your application. You can see it in the file explorer.` };
        setMessages((prev) => [...prev, assistantMessage]);
      }

    } catch (error) {
      console.error("AI Assistant Error:", error);
      const errorMessage = (error instanceof Error) ? error.message : "Could not get a response from the AI. Please try again.";
      toast({
        variant: "destructive",
        title: "AI Assistant Error",
        description: errorMessage,
      });
       const assistantMessage: Message = { role: "assistant", content: `Sorry, I encountered an error: ${errorMessage}` };
       setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card/50 border rounded-lg">
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          <div className="flex items-start gap-3 justify-start">
            <Bot className="h-6 w-6 text-primary flex-shrink-0" />
            <div className="p-3 rounded-lg max-w-sm shadow bg-muted text-foreground">
              <p className="text-sm whitespace-pre-wrap font-sans">I am Synapse, your AI coding partner. Describe the web application you want to build, and I'll generate it for you.</p>
            </div>
          </div>
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex items-start gap-3",
                message.role === "user" ? "justify-end flex-row-reverse" : "justify-start"
              )}
            >
              {message.role === "assistant" ? 
                <Bot className="h-6 w-6 text-primary flex-shrink-0" /> :
                <User className="h-6 w-6 text-accent flex-shrink-0" />
              }
              <div
                className={cn(
                  "p-3 rounded-lg max-w-sm shadow",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                )}
              >
                <pre className="text-sm whitespace-pre-wrap font-sans">{message.content}</pre>
              </div>
            </div>
          ))}
          {isGenerating && (
             <div className="flex items-start gap-3 justify-start">
               <Bot className="h-6 w-6 text-primary flex-shrink-0" />
               <div className="p-3 rounded-lg bg-muted flex items-center shadow">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-sm ml-2 text-primary">Generating...</span>
               </div>
             </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-2 border-t bg-background rounded-b-lg">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe the app you want to build..."
            className="flex-grow h-10 rounded-md border bg-card text-base md:text-sm font-sans"
            disabled={isGenerating}
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isGenerating}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
