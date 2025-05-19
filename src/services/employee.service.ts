import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export type Employee = {
  id: string;
  employee_id: string;
  name: string;
  position: string;
  department: string;
  status: string;
  joining_date: Date;
  basic_salary: number;
  created_at: Date;
  updated_at: Date;
};

export class EmployeeService {
  static async generateEmployeeId(): Promise<string> {
    const latestEmployee = await prisma.employee.findFirst({
      select: {
        employee_id: true
      },
      orderBy: {
        employee_id: 'desc'
      }
    });

    let nextNumber = 1001; // Default starting number
    if (latestEmployee) {
      const match = latestEmployee.employee_id.match(/EMP(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }

    return `EMP${nextNumber}`;
  }

  static async getAllEmployees() {
    return prisma.employee.findMany({
      orderBy: {
        created_at: 'desc'
      }
    });
  }

  static async getActiveEmployeeCount() {
    return prisma.employee.count({
      where: {
        status: 'Active'
      }
    });
  }

  static async createEmployee(data: {
    name: string;
    position: string;
    department: string;
    status?: string;
    joining_date: string;
    basic_salary: number;
  }) {
    const employeeId = await this.generateEmployeeId();

    try {
      return await prisma.employee.create({
        data: {
          id: crypto.randomUUID(),
          employee_id: employeeId,
          name: data.name,
          position: data.position,
          department: data.department,
          status: data.status || 'Active',
          joining_date: new Date(data.joining_date),
          basic_salary: data.basic_salary
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('Employee ID already exists');
        }
      }
      throw error;
    }
  }
} 