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
    { agent: "Requirements Analyst", task: "Analyzing user prompt...", duration: 2500, log: "Analysis complete. The user wants a recipe tracking app with ratings and favorites. Passing to UI/UX Architect for design." },
    { agent: "UI/UX Architect", task: "Sketching main layouts...", duration: 3000, log: "Initial sketches are done. Moving to detailed wireframes for key screens." },
    { agent: "UI/UX Architect", task: "Creating component wireframes...", duration: 2000, log: "Wireframes for all pages and components are complete. Frontend Coder, please begin implementation based on these designs." },
    { agent: "Frontend Coder", task: "Implementing login form component...", duration: 4500, log: "The base component for the login form is built. Now styling and adding state management." },
    { agent: "Frontend Coder", task: "Handling login form submission...", duration: 2500, log: "Login form UI is complete. Backend Coder, I need an authentication endpoint at '/api/auth/login'." },
    { agent: "Backend Coder", task: "Developing auth endpoints...", duration: 3500, log: "The '/api/auth/login' and '/api/auth/register' endpoints are ready and connected to the database. QA Agent, please run integration and security tests." },
    { agent: "QA & Security Agent", task: "Running authentication tests...", duration: 3000, log: "Authentication endpoint tests passed, including checks for SQL injection. DevOps agent, the auth service is cleared for deployment." },
    { agent: "DevOps Agent", task: "Containerizing application...", duration: 4000, log: "Application is containerized with Docker. Preparing deployment to staging environment." },
    { agent: "DevOps Agent", task: "Deploying to staging...", duration: 3000, log: "Deployment to staging successful. The application is ready for final review." },
    { agent: "Orchestrator", task: "All tasks complete.", duration: 1000, log: "The development cycle is complete. The application is deployed and ready for review." },
];

interface AgentsPanelProps {
    isGenerating: boolean;
}

export default function AgentsPanel({ isGenerating }: AgentsPanelProps) {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [logs]);

  useEffect(() => {
    if (isGenerating && currentStep === -1) {
        setCurrentStep(0);
    } else if (!isGenerating) {
        // If generation is cancelled or finished externally
        setCurrentStep(-1);
        setAgents(initialAgents);
    }
  }, [isGenerating, currentStep]);


  useEffect(() => {
    if (currentStep >= 0 && currentStep < simulationPlan.length) {
      const step = simulationPlan[currentStep];
      
      setAgents(prev => prev.map(a => a.name === step.agent ? { ...a, status: step.task } : a));
      
      if (currentStep > 0) {
        const prevStep = simulationPlan[currentStep-1];
         if (prevStep.agent !== step.agent) {
          setLogs(prev => [
              ...prev,
              {
                  id: Date.now(),
                  timestamp: new Date().toLocaleTimeString(),
                  source: "Orchestrator",
                  message: `Task complete. Instructing ${step.agent} to begin: '${step.task}'`
              }
          ]);
        }
      } else {
         setLogs([{
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString(),
            source: "Orchestrator",
            message: `App generation started. Instructing ${step.agent} to begin: '${step.task}'`
        }]);
      }

      const timer = setTimeout(() => {
        setLogs(prev => [
            ...prev,
            {
                id: Date.now() + 1,
                timestamp: new Date().toLocaleTimeString(),
                source: step.agent,
                message: step.log
            }
        ]);

        if (currentStep + 1 < simulationPlan.length && simulationPlan[currentStep+1].agent !== step.agent) {
             setAgents(prev => prev.map(a => a.name === step.agent ? { ...a, status: "Idle" } : a));
        }

        setCurrentStep(currentStep + 1);

      }, step.duration);

      return () => clearTimeout(timer);
    } else if (currentStep === simulationPlan.length) {
        setAgents(initialAgents); // Reset all to idle
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
                {logs.length === 0 && <p className="text-muted-foreground">Ask the AI Assistant to build an app to start the agent workflow...</p>}
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
