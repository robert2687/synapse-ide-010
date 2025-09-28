"use client";

import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { handleAiQuery } from "@/lib/actions";
import type { FileOrFolder, VFSState } from "@/lib/vfs";
import { Bot, Send, User, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

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
        onVFSUpdate(result.data.vfs);
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
