import { useState, useCallback } from 'react';
import { Project } from '@/types';
import { apiService } from '@/services/api.service';

interface UseProjectsOptions {
  onError?: (error: string) => void;
}

export function useProjects({ onError }: UseProjectsOptions = {}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.projects.getAll();
      setProjects(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch projects';
      setError(message);
      onError?.(message);
    } finally {
      setLoading(false);
    }
  }, [onError]);

  const addProject = useCallback(async (project: Partial<Project>) => {
    setLoading(true);
    setError(null);
    try {
      const newProject = await apiService.projects.create(project);
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add project';
      setError(message);
      onError?.(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [onError]);

  const updateProject = useCallback(async (projectId: string, updates: Partial<Project>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedProject = await apiService.projects.update(projectId, updates);
      setProjects(prev => prev.map(project => 
        project.id === projectId ? updatedProject : project
      ));
      return updatedProject;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update project';
      setError(message);
      onError?.(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [onError]);

  const deleteProject = useCallback(async (projectId: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.projects.delete(projectId);
      setProjects(prev => prev.filter(project => project.id !== projectId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete project';
      setError(message);
      onError?.(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [onError]);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    addProject,
    updateProject,
    deleteProject,
  };
} 