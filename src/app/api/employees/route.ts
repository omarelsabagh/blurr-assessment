import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function generateEmployeeId() {
  // Get the latest employee ID using a raw query
  const result = await prisma.$queryRaw<{ employee_id: string }[]>`
    SELECT employee_id 
    FROM Employee 
    ORDER BY employee_id DESC 
    LIMIT 1
  `;

  let nextNumber = 1001; // Default starting number
  if (result.length > 0) {
    // Extract the number from the latest employee ID and increment
    const match = result[0].employee_id.match(/EMP(\d+)/);
    if (match) {
      nextNumber = parseInt(match[1]) + 1;
    }
  }

  return `EMP${nextNumber}`;
}

export async function GET() {
  try {
    const employees = await prisma.$queryRaw<Employee[]>`
      SELECT 
        id,
        employee_id as "employee_id",
        name,
        position,
        department,
        status,
        joining_date as "joining_date",
        basic_salary as "basic_salary",
        created_at as "created_at",
        updated_at as "updated_at"
      FROM Employee 
      ORDER BY created_at DESC
    `;
    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, position, department, status, joining_date, basic_salary } = data;
    
    // Log the received data for debugging
    console.log('Received employee data:', data);
    
    if (!name || !position || !department || !joining_date || basic_salary === undefined) {
      console.log('Missing required fields:', { name, position, department, joining_date, basic_salary });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate a new employee ID
    const employeeId = await generateEmployeeId();
    console.log('Generated employee ID:', employeeId);

    try {
      // Use a raw query to insert the employee
      await prisma.$executeRaw`
        INSERT INTO Employee (
          id, employee_id, name, position, department, status, 
          joining_date, basic_salary, created_at, updated_at
        ) VALUES (
          ${crypto.randomUUID()}, ${employeeId}, ${name}, ${position}, 
          ${department}, ${status || 'Active'}, ${new Date(joining_date)}, 
          ${basic_salary}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
      `;

      // Fetch the created employee
      const employee = await prisma.$queryRaw<Employee[]>`
        SELECT * FROM Employee WHERE employee_id = ${employeeId}
      `;

      if (!employee || employee.length === 0) {
        throw new Error('Failed to fetch created employee');
      }

      return NextResponse.json(employee[0], { status: 201 });
    } catch (dbError) {
      console.error('Database error:', dbError);
      if (dbError instanceof Prisma.PrismaClientKnownRequestError) {
        if (dbError.code === 'P2002') {
          return NextResponse.json({ error: 'Employee ID already exists' }, { status: 400 });
        }
      }
      throw dbError; // Re-throw to be caught by outer catch
    }
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { error: 'Failed to create employee', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

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