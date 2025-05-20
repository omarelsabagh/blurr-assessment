"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import KanbanBoard from "@/components/kanban-board";
import { BacklogTable } from "@/components/backlog-table";
import { TaskForm } from "@/components/task-form";
import { Modal } from "@/components/ui/modal";
import { use } from "react";
import { useTasks } from "@/hooks/use-tasks";
import { useProject } from "@/hooks/use-project";
import { useState } from "react";
import { Task } from "@/types";

export default function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const {
    project,
    loading: projectLoading,
    error: projectError,
    fetchProject,
  } = useProject(id);

  const {
    tasks,
    loading: taskLoading,
    error: taskError,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
  } = useTasks({ projectId: id });

  useEffect(() => {
    fetchProject();
    fetchTasks();
  }, [id, fetchProject, fetchTasks]);

  if (projectLoading || taskLoading) return <div className="p-6">Loading...</div>;
  if (projectError) return <div className="p-6">Error: {projectError}</div>;
  if (taskError) return <div className="p-6">Error: {taskError}</div>;
  if (!project) return <div className="p-6">Project not found</div>;

  const handleAddTask = async (task: Partial<Task>) => {
    try {
      await addTask(task);
      setShowTaskForm(false);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleEditTask = async (task: Partial<Task>) => {
    if (!editingTask?.id) return;
    try {
      await updateTask(editingTask.id, task);
      setEditingTask(null);
      setShowTaskForm(false);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleRemoveFromBoard = async (taskId: string) => {
    try {
      await updateTaskStatus(taskId, "backlog");
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleAddToBoard = async (task: Task) => {
    try {
      await updateTaskStatus(task.id, "todo");
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>
        <h1 className="text-2xl font-bold">{project.title}</h1>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Backlog</h2>
        </div>
        <BacklogTable
          tasks={tasks}
          onEditTask={(task: Task) => {
            setEditingTask(task);
            setShowTaskForm(true);
          }}
          onDeleteTask={handleRemoveFromBoard}
          onAddToBoard={handleAddToBoard}
          onAddTask={() => {
            setEditingTask(null);
            setShowTaskForm(true);
          }}
        />
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Tasks</h2>
          <Button
            onClick={() => {
              setEditingTask(null);
              setShowTaskForm(true);
            }}
            className="cursor-pointer"
          >
            Add Task
          </Button>
        </div>
        <KanbanBoard
          tasks={tasks}
          onEditTask={(task: Task) => {
            setEditingTask(task);
            setShowTaskForm(true);
          }}
          onDeleteTask={handleRemoveFromBoard}
          onUpdateTaskStatus={updateTaskStatus}
        />
      </div>

      <Modal
        isOpen={showTaskForm}
        onClose={() => {
          setShowTaskForm(false);
          setEditingTask(null);
        }}
        title={editingTask ? "Edit Task" : "Add Task"}
      >
        <TaskForm
          task={editingTask}
          projectId={id}
          onSubmit={editingTask ? handleEditTask : handleAddTask}
          onCancel={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
        />
      </Modal>
    </div>
  );
} 