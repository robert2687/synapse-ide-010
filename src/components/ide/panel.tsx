import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { ResizablePanel } from "@/components/ui/resizable";

interface PanelProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
  defaultSize?: number;
}

const Panel = ({ title, icon, children, className, defaultSize }: PanelProps) => {
  return (
    <div className={cn("flex flex-col h-full bg-card/50", className)}>
      <header className="flex items-center gap-2 p-2 border-b h-10 flex-shrink-0">
        <div className="text-muted-foreground">{icon}</div>
        <h2 className="text-sm font-medium">{title}</h2>
      </header>
      <div className="flex-grow overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default Panel;
