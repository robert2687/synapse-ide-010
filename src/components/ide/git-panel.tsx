"use client";

import { Button } from "@/components/ui/button";
import { GitBranch, GitCommit, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockCommits = [
  {
    hash: "a1b2c3d",
    message: "feat: Implement live preview panel",
    author: "AI Assistant",
    time: "2 hours ago",
  },
  {
    hash: "e4f5g6h",
    message: "fix: Editor content not updating",
    author: "Developer",
    time: "1 day ago",
  },
  {
    hash: "i7j8k9l",
    message: "chore: Initial project setup",
    author: "Developer",
    time: "2 days ago",
  },
];

export default function GitPanel() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-2 space-y-2 border-b">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
                <GitBranch className="h-4 w-4 text-muted-foreground" />
                <span>main</span>
            </div>
            <Badge variant="secondary">2 ahead</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="w-full">
            <GitCommit className="mr-2 h-4 w-4" /> Commit
          </Button>
          <Button variant="outline" size="sm">
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-grow overflow-auto p-2">
        <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Commits on main</h3>
        <ul className="space-y-2">
          {mockCommits.map((commit) => (
            <li key={commit.hash} className="p-2 rounded-md hover:bg-muted">
              <p className="font-medium text-sm truncate">{commit.message}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                <span>{commit.author}</span>
                <div className="flex items-center gap-2">
                    <span>{commit.time}</span>
                    <span className="font-mono bg-background p-0.5 rounded-sm">{commit.hash}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
