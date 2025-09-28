"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
}

export default function AiAssistant({ vfs, activeFile }: AiAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const fileContents: Record<string, string> = {};
      for (const file of Object.values(vfs)) {
        if (file.type === "file") {
          fileContents[file.name] = file.content;
        }
      }

      const result = await handleAiQuery(input, fileContents, activeFile?.name);
      
      const assistantMessage: Message = { role: "assistant", content: result.response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      toast({
        variant: "destructive",
        title: "AI Assistant Error",
        description: "Could not get a response from the AI. Please try again.",
      });
       const assistantMessage: Message = { role: "assistant", content: "Sorry, I encountered an error. Please try again." };
       setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card/50">
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
                    : "bg-muted"
                )}
              >
                <pre className="text-sm whitespace-pre-wrap font-sans">{message.content}</pre>
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex items-start gap-3 justify-start">
               <Bot className="h-6 w-6 text-primary flex-shrink-0" />
               <div className="p-3 rounded-lg bg-muted flex items-center shadow">
                  <Loader2 className="h-5 w-5 animate-spin" />
               </div>
             </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-2 border-t bg-card/50">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the AI to generate code, refactor, or explain..."
            className="flex-grow resize-none text-sm min-h-[40px] rounded-md border bg-card"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
