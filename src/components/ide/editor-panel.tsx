"use client";

import { Textarea } from "@/components/ui/textarea";
import type { FileOrFolder } from "@/lib/vfs";
import { FileIcon } from "../icons";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorPanelProps {
  openFiles: FileOrFolder[];
  activeFile: FileOrFolder | null;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onContentChange: (id: string, content: string) => void;
}

export default function EditorPanel({
  openFiles,
  activeFile,
  onSelectTab,
  onCloseTab,
  onContentChange,
}: EditorPanelProps) {

  if (!activeFile || activeFile.type !== "file") {
    return (
      <div className="h-full flex items-center justify-center bg-card text-muted-foreground">
        <p>Select a file to begin editing.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="flex border-b bg-background/50">
        {openFiles.map((file) => (
          <div
            key={file.id}
            onClick={() => onSelectTab(file.id)}
            className={cn(
              "flex items-center gap-2 p-2 border-r cursor-pointer text-sm whitespace-nowrap",
              activeFile.id === file.id
                ? "bg-card border-b-2 border-b-primary -mb-px"
                : "text-muted-foreground"
            )}
          >
            <FileIcon filename={file.name} className="h-4 w-4" />
            <span>{file.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCloseTab(file.id);
              }}
              className="p-0.5 rounded hover:bg-muted-foreground/20"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      <Textarea
        key={activeFile.id}
        value={activeFile.content}
        onChange={(e) => onContentChange(activeFile.id, e.target.value)}
        className="w-full h-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
        aria-label={`Editing file ${activeFile.name}`}
      />
    </div>
  );
}
