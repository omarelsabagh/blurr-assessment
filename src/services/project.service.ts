import { prisma } from '@/lib/prisma';

export class ProjectService {
  static async createProject(data: {
    title: string;
    description?: string;
    status?: string;
  }) {
    return prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status || 'active',
      },
    });
  }

  static async getProjects() {
    return prisma.project.findMany({
      include: {
        tasks: {
          include: {
            employee: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  static async getProjectById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        tasks: {
          include: {
            employee: true,
          },
        },
      },
    });
  }

  static async updateProject(
    id: string,
    data: {
      title?: string;
      description?: string;
      status?: string;
    }
  ) {
    return prisma.project.update({
      where: { id },
      data,
    });
  }

  static async deleteProject(id: string) {
    return prisma.project.delete({
      where: { id },
    });
  }
} 