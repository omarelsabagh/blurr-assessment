import { prisma } from '@/lib/prisma';

export class TaskService {
  static async createTask(data: {
    title: string;
    description?: string;
    priority?: string;
    status?: string;
    project_id: string;
    assigned_to?: string;
  }) {
    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority || 'medium',
        status: data.status || 'todo',
        project_id: data.project_id,
        assigned_to: data.assigned_to === 'unassigned' ? null : data.assigned_to,
      },
      include: {
        employee: true,
        project: true,
      },
    });
  }

  static async getTasks(projectId?: string) {
    return prisma.task.findMany({
      where: projectId ? { project_id: projectId } : undefined,
      include: {
        employee: true,
        project: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  static async getTaskById(id: string) {
    return prisma.task.findUnique({
      where: { id },
      include: {
        employee: true,
        project: true,
      },
    });
  }

  static async updateTask(
    id: string,
    data: {
      title?: string;
      description?: string;
      priority?: string;
      status?: string;
      assigned_to?: string;
    }
  ) {
    return prisma.task.update({
      where: { id },
      data: {
        ...data,
        assigned_to: data.assigned_to === 'unassigned' ? null : data.assigned_to,
      },
      include: {
        employee: true,
        project: true,
      },
    });
  }

  static async deleteTask(id: string) {
    return prisma.task.delete({
      where: { id },
    });
  }
} 