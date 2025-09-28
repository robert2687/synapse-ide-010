
"use client";

import { VFSState } from "@/lib/vfs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FileIcon } from "../icons";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorPanelProps {
    vfs: VFSState;
    openFileIds: string[];
    activeFileId: string | null;
    onFileSelect: (id: string) => void;
    onFileContentChange: (id: string, content: string) => void;
    onCloseTab: (id: string) => void;
}

export default function EditorPanel({ 
    vfs, 
    openFileIds, 
    activeFileId, 
    onFileSelect, 
    onFileContentChange,
    onCloseTab
}: EditorPanelProps) {
    if (openFileIds.length === 0 || !activeFileId) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Select a file to start editing.</p>
            </div>
        );
    }
    
    const activeFile = vfs[activeFileId];

    return (
        <div className="flex flex-col h-full bg-card/50 border rounded-lg">
            <div className="flex-shrink-0 border-b">
                 <Tabs value={activeFileId} onValueChange={onFileSelect} className="w-full">
                    <TabsList className="bg-transparent p-0 m-0 rounded-none h-10 border-none justify-start">
                        {openFileIds.map(id => {
                            const file = vfs[id];
                            return (
                                <div key={id} className="relative">
                                    <TabsTrigger
                                        value={id}
                                        className={cn(
                                            "h-full flex items-center gap-2 rounded-none border-b-2 border-r border-transparent bg-transparent pl-4 pr-8 data-[state=active]:bg-background data-[state=active]:border-primary data-[state=active]:shadow-none",
                                            "hover:bg-muted/50"
                                        )}
                                    >
                                        <FileIcon filename={file.name} className="h-4 w-4" />
                                        <span>{file.name}</span>
                                    </TabsTrigger>
                                     <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onCloseTab(id);
                                        }} 
                                        className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-sm p-0.5 hover:bg-muted-foreground/20"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            )
                        })}
                    </TabsList>
                 </Tabs>
            </div>
            <div className="flex-grow relative">
                <Textarea
                    value={activeFile?.type === 'file' ? activeFile.content : ''}
                    onChange={(e) => onFileContentChange(activeFileId, e.target.value)}
                    className="absolute inset-0 w-full h-full p-4 border-0 rounded-none"
                    placeholder="Start typing..."
                />
            </div>
        </div>
    );
}
