"use client";

import type { VFSState, FileOrFolder, Folder } from "@/lib/vfs";
import { useState } from "react";
import { FileIcon } from "@/components/icons";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";

interface FileExplorerProps {
  vfs: VFSState;
  onFileSelect: (id: string) => void;
  activeFileId: string | null;
}

const FileNode = ({
  node,
  vfs,
  onFileSelect,
  activeFileId,
  level,
}: {
  node: FileOrFolder;
  vfs: VFSState;
  onFileSelect: (id: string) => void;
  activeFileId: string | null;
  level: number;
}) => {
  const [isOpen, setIsOpen] = useState(true);

  if (node.type === "folder") {
    return (
      <div>
        <div
          className="flex items-center gap-1 cursor-pointer p-1 rounded-md hover:bg-muted"
          onClick={() => setIsOpen(!isOpen)}
          style={{ paddingLeft: `${level * 12 + 4}px` }}
        >
          {isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          <span className="text-sm font-medium">{node.name}</span>
        </div>
        {isOpen && (
          <div>
            {(node as Folder).children.map((childId) => (
              <FileNode
                key={childId}
                node={vfs[childId]}
                vfs={vfs}
                onFileSelect={onFileSelect}
                activeFileId={activeFileId}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const getStatusColor = (status?: 'modified' | 'untracked') => {
    if (status === 'modified') return 'text-yellow-500';
    if (status === 'untracked') return 'text-green-500';
    return 'text-muted-foreground';
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 cursor-pointer p-1 rounded-md hover:bg-muted",
        activeFileId === node.id && "bg-muted"
      )}
      onClick={() => onFileSelect(node.id)}
      style={{ paddingLeft: `${level * 12 + 4}px` }}
    >
      <FileIcon filename={node.name} className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm flex-grow truncate">{node.name}</span>
      {node.status && (
        <span className={cn('text-xs font-bold', getStatusColor(node.status))}>
          {node.status === 'modified' ? 'M' : 'U'}
        </span>
      )}
    </div>
  );
};

export default function FileExplorer({ vfs, onFileSelect, activeFileId }: FileExplorerProps) {
  const root = vfs["0"];
  return (
    <ScrollArea className="h-full">
      <div className="p-2 text-sm">
        <FileNode node={root} vfs={vfs} onFileSelect={onFileSelect} activeFileId={activeFileId} level={0} />
      </div>
    </ScrollArea>
  );
}
