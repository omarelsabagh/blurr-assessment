import { prisma } from '@/lib/prisma';
import { randomUUID } from 'crypto';

export type SalaryRecord = {
  id: string;
  employee_id: string;
  name: string;
  basic_salary: number;
  bonus: number;
  deductible: number;
  month: number;
  year: number;
};

export class SalaryService {
  static async getSalaryRecords(year: number, month: number): Promise<SalaryRecord[]> {
    // Get all employees
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        employee_id: true,
        name: true,
        basic_salary: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    // Get existing salary records for the month
    const salaryRecords = await prisma.salary.findMany({
      where: {
        year,
        month
      },
      include: {
        employee: {
          select: {
            name: true,
            basic_salary: true
          }
        }
      }
    });

    // Create a map of existing records
    const existingRecords = new Map(
      salaryRecords.map(record => [record.employee_id, record])
    );

    // Combine employee data with salary records
    return employees.map(employee => {
      const existingRecord = existingRecords.get(employee.employee_id);
      if (existingRecord) {
        return {
          id: existingRecord.id,
          employee_id: employee.employee_id,
          name: employee.name,
          basic_salary: employee.basic_salary,
          bonus: existingRecord.bonus,
          deductible: existingRecord.deductible,
          month,
          year
        };
      }

      // Create a new record for employees without one
      return {
        id: '',
        employee_id: employee.employee_id,
        name: employee.name,
        basic_salary: employee.basic_salary,
        bonus: 0,
        deductible: 0,
        month,
        year
      };
    });
  }

  static async updateSalaryRecord(data: {
    employee_id: string;
    year: number;
    month: number;
    bonus?: number;
    deductible?: number;
  }) {
    const { employee_id, year, month, bonus = 0, deductible = 0 } = data;

    // Ensure bonus and deductible are numbers
    const bonusValue = Number(bonus) || 0;
    const deductibleValue = Number(deductible) || 0;

    // Check if a record exists for this employee and month
    const existingRecord = await prisma.salary.findFirst({
      where: {
        employee_id,
        year,
        month
      }
    });

    if (existingRecord) {
      // Update existing record
      return prisma.salary.update({
        where: {
          id: existingRecord.id
        },
        data: {
          bonus: bonusValue,
          deductible: deductibleValue,
          updated_at: new Date()
        }
      });
    } else {
      // Create new record
      return prisma.salary.create({
        data: {
          id: randomUUID(),
          employee_id,
          year,
          month,
          bonus: bonusValue,
          deductible: deductibleValue
        }
      });
    }
  }
} 