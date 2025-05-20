import { useState, useCallback } from 'react';
import { Task } from '@/types';
import { apiService } from '@/services/api.service';

interface UseTasksOptions {
  projectId?: string;
  onError?: (error: string) => void;
}

export function useTasks({ projectId, onError }: UseTasksOptions = {}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.tasks.getAll(projectId);
      setTasks(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(message);
      onError?.(message);
    } finally {
      setLoading(false);
    }
  }, [projectId, onError]);

  const addTask = useCallback(async (task: Partial<Task>) => {
    setLoading(true);
    setError(null);
    try {
      const newTask = await apiService.tasks.create({
        ...task,
        project_id: projectId,
      });
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add task';
      setError(message);
      onError?.(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [projectId, onError]);

  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTask = await apiService.tasks.update(taskId, updates);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      return updatedTask;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update task';
      setError(message);
      onError?.(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [onError]);

  const deleteTask = useCallback(async (taskId: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.tasks.delete(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete task';
      setError(message);
      onError?.(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [onError]);

  const updateTaskStatus = useCallback(async (taskId: string, newStatus: Task['status']) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Optimistically update the UI
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    ));

    try {
      await apiService.tasks.update(taskId, { ...task, status: newStatus });
    } catch (err) {
      // Revert the optimistic update if the request fails
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: task.status } : t
      ));
      const message = err instanceof Error ? err.message : 'Failed to update task status';
      setError(message);
      onError?.(message);
      throw err;
    }
  }, [tasks, onError]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
  };
} 