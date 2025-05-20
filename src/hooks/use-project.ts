import { useState, useCallback } from 'react';
import { Project } from '@/types';
import { apiService } from '@/services/api.service';

interface UseProjectOptions {
  onError?: (error: string) => void;
}

export function useProject(projectId: string, { onError }: UseProjectOptions = {}) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.projects.getById(projectId);
      setProject(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch project';
      setError(message);
      onError?.(message);
    } finally {
      setLoading(false);
    }
  }, [projectId, onError]);

  return {
    project,
    loading,
    error,
    fetchProject,
  };
} 