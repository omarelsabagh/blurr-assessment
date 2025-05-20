import { Project, Task, Employee } from '@/types';

const API_BASE = '/api';

export const apiService = {
  // Project endpoints
  projects: {
    getAll: async (): Promise<Project[]> => {
      const response = await fetch(`${API_BASE}/projects`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      return response.json();
    },
    getById: async (id: string): Promise<Project> => {
      const response = await fetch(`${API_BASE}/projects/${id}`);
      if (!response.ok) throw new Error('Failed to fetch project');
      return response.json();
    },
    create: async (project: Partial<Project>): Promise<Project> => {
      const response = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      if (!response.ok) throw new Error('Failed to create project');
      return response.json();
    },
    update: async (id: string, project: Partial<Project>): Promise<Project> => {
      const response = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      if (!response.ok) throw new Error('Failed to update project');
      return response.json();
    },
    delete: async (id: string): Promise<void> => {
      const response = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete project');
    },
  },

  // Task endpoints
  tasks: {
    getAll: async (projectId?: string): Promise<Task[]> => {
      const url = projectId 
        ? `${API_BASE}/tasks?projectId=${projectId}`
        : `${API_BASE}/tasks`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      return response.json();
    },
    getById: async (id: string): Promise<Task> => {
      const response = await fetch(`${API_BASE}/tasks/${id}`);
      if (!response.ok) throw new Error('Failed to fetch task');
      return response.json();
    },
    create: async (task: Partial<Task>): Promise<Task> => {
      const response = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      if (!response.ok) throw new Error('Failed to create task');
      return response.json();
    },
    update: async (id: string, task: Partial<Task>): Promise<Task> => {
      const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      if (!response.ok) throw new Error('Failed to update task');
      return response.json();
    },
    delete: async (id: string): Promise<void> => {
      const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete task');
    },
  },

  // Employee endpoints
  employees: {
    getAll: async (): Promise<Employee[]> => {
      const response = await fetch(`${API_BASE}/employees`);
      if (!response.ok) throw new Error('Failed to fetch employees');
      return response.json();
    },
    getById: async (id: string): Promise<Employee> => {
      const response = await fetch(`${API_BASE}/employees/${id}`);
      if (!response.ok) throw new Error('Failed to fetch employee');
      return response.json();
    },
    create: async (employee: Partial<Employee>): Promise<Employee> => {
      const response = await fetch(`${API_BASE}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee),
      });
      if (!response.ok) throw new Error('Failed to create employee');
      return response.json();
    },
    update: async (id: string, employee: Partial<Employee>): Promise<Employee> => {
      const response = await fetch(`${API_BASE}/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee),
      });
      if (!response.ok) throw new Error('Failed to update employee');
      return response.json();
    },
    delete: async (id: string): Promise<void> => {
      const response = await fetch(`${API_BASE}/employees/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete employee');
    },
  },
}; 