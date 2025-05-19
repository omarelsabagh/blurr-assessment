import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Define the Employee type to match our database schema
type Employee = {
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

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const employee = await prisma.employee.findUnique({ where: { id: params.id } });
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }
    return NextResponse.json(employee);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch employee' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const { employee_id, name, position, department, status, joining_date, basic_salary } = data;
    if (!employee_id || !name || !position || !department || !joining_date || basic_salary === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Use raw query to update the employee
    await prisma.$executeRaw`
      UPDATE employees 
      SET 
        employee_id = ${employee_id},
        name = ${name},
        position = ${position},
        department = ${department},
        status = ${status},
        joining_date = ${new Date(joining_date)},
        basic_salary = ${basic_salary},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${params.id}
    `;

    // Fetch the updated employee
    const employee = await prisma.$queryRaw<Employee[]>`
      SELECT * FROM employees WHERE id = ${params.id}
    `;

    return NextResponse.json(employee[0]);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'Employee ID already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.employee.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
  }
} 