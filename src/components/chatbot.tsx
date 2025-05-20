"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send } from "lucide-react";
import { useProjects } from "@/hooks/use-projects";
import { useTasks } from "@/hooks/use-tasks";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your project assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { projects, fetchProjects } = useProjects();
  const { tasks, fetchTasks } = useTasks();

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
      fetchTasks();
    }
  }, [isOpen, fetchProjects, fetchTasks]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processUserQuery = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    // Project related queries
    if (lowerQuery.includes("project") || lowerQuery.includes("projects")) {
      if (lowerQuery.includes("list") || lowerQuery.includes("all")) {
        return `Here are your projects:\n${projects
          .map((p) => `- ${p.title} (${p.status})`)
          .join("\n")}`;
      }
      if (lowerQuery.includes("active")) {
        const activeProjects = projects.filter((p) => p.status === "active");
        return `You have ${activeProjects.length} active projects:\n${activeProjects
          .map((p) => `- ${p.title}`)
          .join("\n")}`;
      }
    }

    // Task related queries
    if (lowerQuery.includes("task") || lowerQuery.includes("tasks")) {
      if (lowerQuery.includes("list") || lowerQuery.includes("all")) {
        return `Here are all your tasks:\n${tasks
          .map(
            (t) =>
              `- ${t.title} (${t.status}, Priority: ${t.priority})${
                t.assigned_to ? ` - Assigned to: ${t.employee?.name}` : ""
              }`
          )
          .join("\n")}`;
      }
      if (lowerQuery.includes("todo") || lowerQuery.includes("to do")) {
        const todoTasks = tasks.filter((t) => t.status === "todo");
        return `You have ${todoTasks.length} tasks in To Do:\n${todoTasks
          .map((t) => `- ${t.title}`)
          .join("\n")}`;
      }
      if (lowerQuery.includes("in progress")) {
        const inProgressTasks = tasks.filter((t) => t.status === "in_progress");
        return `You have ${inProgressTasks.length} tasks in progress:\n${inProgressTasks
          .map((t) => `- ${t.title}`)
          .join("\n")}`;
      }
      if (lowerQuery.includes("completed")) {
        const completedTasks = tasks.filter((t) => t.status === "completed");
        return `You have ${completedTasks.length} completed tasks:\n${completedTasks
          .map((t) => `- ${t.title}`)
          .join("\n")}`;
      }
    }

    // Help query
    if (lowerQuery.includes("help")) {
      return `I can help you with the following:
- List all projects
- Show active projects
- List all tasks
- Show tasks by status (todo, in progress, completed)
- Show tasks by priority
- Show tasks assigned to specific employees`;
    }

    return "I'm not sure I understand. Try asking for 'help' to see what I can do!";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      const response = processUserQuery(userMessage);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-12 h-12 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="w-96 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold">Project Assistant</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              ×
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96 mb-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your projects and tasks..."
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 