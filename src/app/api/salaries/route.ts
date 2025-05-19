import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
  const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString());

  try {
    // Get all employees
    const employees = await prisma.$queryRaw`
      SELECT id, employee_id, name, basic_salary
      FROM Employee
      ORDER BY created_at DESC
    `;

    // Get existing salary records for the month
    const salaryRecords = await prisma.$queryRaw`
      SELECT s.id, s.employee_id, s.bonus, s.deductible, s.month, s.year,
             e.name, e.basic_salary
      FROM Salary s
      JOIN Employee e ON s.employee_id = e.employee_id
      WHERE s.year = ${year} AND s.month = ${month}
    `;

    // Create a map of existing records
    const existingRecords = new Map(
      (salaryRecords as any[]).map(record => [record.employee_id, record])
    );

    // Combine employee data with salary records
    const records = (employees as any[]).map(employee => {
      const existingRecord = existingRecords.get(employee.employee_id);
      if (existingRecord) {
        return {
          id: existingRecord.id,
          employee_id: employee.employee_id,
          name: employee.name,
          basic_salary: employee.basic_salary,
          bonus: existingRecord.bonus,
          deductible: existingRecord.deductible,
          month: month,
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
        month: month,
        year
      };
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error('Error fetching salary records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch salary records' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { employee_id, year, month, bonus = 0, deductible = 0 } = data;

    if (!employee_id || !year || !month) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Ensure bonus and deductible are numbers
    const bonusValue = Number(bonus) || 0;
    const deductibleValue = Number(deductible) || 0;

    // Check if a record exists for this employee and month
    const existingRecord = await prisma.$queryRaw`
      SELECT id FROM Salary
      WHERE employee_id = ${employee_id}
      AND year = ${year}
      AND month = ${month}
    `;

    if ((existingRecord as any[]).length > 0) {
      // Update existing record
      await prisma.$executeRaw`
        UPDATE Salary
        SET bonus = ${bonusValue},
            deductible = ${deductibleValue},
            updated_at = CURRENT_TIMESTAMP
        WHERE employee_id = ${employee_id}
        AND year = ${year}
        AND month = ${month}
      `;
    } else {
      // Create new record with UUID
      await prisma.$executeRaw`
        INSERT INTO Salary (
          id,
          employee_id,
          year,
          month,
          bonus,
          deductible,
          created_at,
          updated_at
        ) VALUES (
          ${randomUUID()},
          ${employee_id},
          ${year},
          ${month},
          ${bonusValue},
          ${deductibleValue},
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP
        )
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating salary record:', error);
    return NextResponse.json(
      { error: 'Failed to update salary record', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 