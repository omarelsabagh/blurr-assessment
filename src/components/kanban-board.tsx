"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from 'lucide-react';
import { Task, Employee, Project } from "@/types";

interface KanbanBoardProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => Promise<void>;
  onUpdateTaskStatus: (taskId: string, newStatus: Task["status"]) => Promise<void>;
}

const columns = {
  todo: {
    title: 'To Do',
    color: 'bg-gray-100',
  },
  in_progress: {
    title: 'In Progress',
    color: 'bg-blue-100',
  },
  completed: {
    title: 'Completed',
    color: 'bg-green-100',
  },
};

export default function KanbanBoard({ tasks, onEditTask, onDeleteTask, onUpdateTaskStatus }: KanbanBoardProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchEmployees();
    fetchProjects();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees');
      if (!response.ok) throw new Error('Failed to fetch employees');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.employee_id === employeeId);
    return employee ? employee.name : employeeId;
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(proj => proj.id === projectId);
    return project ? project.title : projectId;
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;

    await onUpdateTaskStatus(
      draggableId,
      destination.droppableId as Task["status"]
    );
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Task Board</CardTitle>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(columns).map(([status, { title, color }]) => (
              <div key={status} className="flex flex-col">
                <h3 className="font-semibold mb-2">{title}</h3>
                <Droppable droppableId={status}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`${color} p-4 rounded-lg min-h-[500px]`}
                    >
                      {tasks
                        .filter(task => task.status === status)
                        .map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-white p-4 rounded-lg shadow-sm mb-3"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-medium">{task.title}</h4>
                                  <div className="flex gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => onEditTask(task)}
                                      className="cursor-pointer p-1 h-8 w-8"
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => onDeleteTask(task.id)}
                                      className="cursor-pointer p-1 h-8 w-8"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                {task.description && (
                                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                                )}
                                <div className="flex flex-col gap-2">
                                  <div className="flex gap-2">
                                    <Badge className={getPriorityColor(task.priority)}>
                                      {task.priority}
                                    </Badge>
                                    {task.assigned_to && (
                                      <Badge variant="outline">
                                        Assigned to: {getEmployeeName(task.assigned_to)}
                                      </Badge>
                                    )}
                                  </div>
                                  <Badge variant="secondary">
                                    Project: {getProjectName(task.project_id)}
                                  </Badge>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </CardContent>
    </Card>
  );
} 