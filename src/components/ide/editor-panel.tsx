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
            onClick={() => onSelectTab(file.id)}
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
                onCloseTab(file.id);
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
        onChange={(e) => onContentChange(activeFile.id, e.target.value)}
        className="w-full h-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none bg-card"
        aria-label={`Editing file ${activeFile.name}`}
      />
    </div>
  );
}
