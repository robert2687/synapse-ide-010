"use client";

import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { GitBranch, GitCommit, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "../ui/scroll-area";

const mockCommits = [
  { day: "Mon", commits: 2 },
  { day: "Tue", commits: 5 },
  { day: "Wed", commits: 3 },
  { day: "Thu", commits: 7 },
  { day: "Fri", commits: 4 },
  { day: "Sat", commits: 1 },
  { day: "Sun", commits: 0 },
];

const chartConfig = {
  commits: {
    label: "Commits",
    color: "hsl(var(--primary))",
  },
};

export default function GitPanel() {
  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col h-full p-2">
        <div className="space-y-2 border-b pb-2 mb-2">
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
        <div className="flex-grow overflow-auto">
          <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Commit Activity (Last 7 Days)</h3>
          <ChartContainer config={chartConfig} className="w-full h-[150px]">
            <ResponsiveContainer>
              <BarChart data={mockCommits} margin={{ top: 5, right: 10, left: -20, bottom: -10 }}>
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} allowDecimals={false} />
                <Tooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="commits" fill="var(--color-commits)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </ScrollArea>
  );
}
