"use client";

import { useState, useEffect, useRef } from "react";
import { Bot, Cpu, Code, TestTube, HardHat, ChevronRight, Loader2 } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";

type AgentName = "Orchestrator" | "Requirements Analyst" | "UI/UX Architect" | "Frontend Coder" | "Backend Coder" | "QA & Security Agent" | "DevOps Agent";

type Agent = {
  name: AgentName;
  status: string;
  icon: React.ElementType;
};

type LogEntry = {
  id: number;
  timestamp: string;
  source: AgentName;
  message: string;
};

const initialAgents: Agent[] = [
  { name: "Orchestrator", status: "Idle", icon: Cpu },
  { name: "Requirements Analyst", status: "Idle", icon: Bot },
  { name: "UI/UX Architect", status: "Idle", icon: Bot },
  { name: "Frontend Coder", status: "Idle", icon: Code },
  { name: "Backend Coder", status: "Idle", icon: Code },
  { name: "QA & Security Agent", status: "Idle", icon: TestTube },
  { name: "DevOps Agent", status: "Idle", icon: HardHat },
];

const simulationPlan = [
    { agent: "Requirements Analyst", task: "Analyzing user prompt...", duration: 2000, log: "I have analyzed the user's request to build a recipe tracking app. I will now pass the requirements to the UI/UX Architect." },
    { agent: "UI/UX Architect", task: "Creating wireframes...", duration: 3000, log: "Wireframes for the main pages are complete. Frontend Coder, please begin implementation." },
    { agent: "Frontend Coder", task: "Implementing login form...", duration: 4000, log: "The login form component is built. Backend Coder, I need the authentication endpoint." },
    { agent: "Backend Coder", task: "Developing API endpoints...", duration: 3500, log: "The '/api/login' endpoint is ready. QA Agent, please run tests." },
    { agent: "QA & Security Agent", task: "Running unit tests...", duration: 3000, log: "Unit tests for the authentication service have passed. DevOps agent, you can now proceed with deployment." },
    { agent: "DevOps Agent", task: "Containerizing application...", duration: 4000, log: "The application is containerized and ready for staging deployment." },
    { agent: "Orchestrator", task: "All tasks complete.", duration: 1000, log: "The development cycle is complete. The application is ready for review." },
];


export default function AgentsPanel() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    // A simple trigger to start the simulation
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === ' ' && e.ctrlKey) { // Ctrl+Space to start
            if (currentStep === -1) {
                setCurrentStep(0);
            }
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep]);


  useEffect(() => {
    if (currentStep >= 0 && currentStep < simulationPlan.length) {
      const step = simulationPlan[currentStep];
      
      // Update agent status
      setAgents(prev => prev.map(a => a.name === step.agent ? { ...a, status: step.task } : a));
      
      // Add orchestrator log before the task
      if (currentStep > 0) {
        const prevStep = simulationPlan[currentStep-1];
        setLogs(prev => [
            ...prev,
            {
                id: Date.now(),
                timestamp: new Date().toLocaleTimeString(),
                source: "Orchestrator",
                message: `Notifying ${step.agent}: ${prevStep.log}`
            }
        ]);
      }


      const timer = setTimeout(() => {
        // Reset previous agent to Idle
        if (currentStep > 0) {
            const prevStep = simulationPlan[currentStep-1];
            setAgents(prev => prev.map(a => a.name === prevStep.agent ? { ...a, status: "Idle" } : a));
        }

        // Move to next step
        setCurrentStep(currentStep + 1);

      }, step.duration);

      return () => clearTimeout(timer);
    } else if (currentStep === simulationPlan.length) {
        // End of simulation, reset all to idle
        setAgents(initialAgents);
        setCurrentStep(-1); // Ready for another run
    }
  }, [currentStep]);

  return (
    <div className="flex flex-col h-full text-sm">
        <div className="p-2 border-b">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground">Agents Status</h3>
        </div>
        <div className="p-2 space-y-2">
            {agents.map(agent => (
                <div key={agent.name} className="flex items-center gap-2">
                    <agent.icon className={cn("h-4 w-4", agent.status === 'Idle' ? 'text-muted-foreground' : 'text-primary animate-pulse')} />
                    <div className="flex-grow">
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-xs text-muted-foreground">{agent.status}</p>
                    </div>
                    {agent.status !== 'Idle' && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                </div>
            ))}
        </div>
        <div className="p-2 border-b border-t">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground">Terminal</h3>
        </div>
        <ScrollArea className="flex-grow p-2" ref={scrollAreaRef}>
            <div className="space-y-2 font-mono text-xs">
                {logs.length === 0 && <p className="text-muted-foreground">Press Ctrl+Space to start agent simulation...</p>}
                {logs.map(log => (
                    <div key={log.id} className="flex gap-2 items-start">
                        <span className="text-muted-foreground/50">{log.timestamp}</span>
                        <ChevronRight className="h-3 w-3 flex-shrink-0 text-muted-foreground mt-0.5" />
                        <p>
                            <span className={cn("font-bold", log.source === 'Orchestrator' ? 'text-accent' : 'text-primary')}>{log.source}: </span>
                            <span className="text-foreground/80">{log.message}</span>
                        </p>
                    </div>
                ))}
            </div>
        </ScrollArea>
    </div>
  );
}
