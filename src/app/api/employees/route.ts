import { NextRequest, NextResponse } from 'next/server';
import { EmployeeService } from '@/services/employee.service';

export async function GET() {
  try {
    const employees = await EmployeeService.getAllEmployees();
    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, position, department, status, joining_date, basic_salary } = data;
    
    if (!name || !position || !department || !joining_date || basic_salary === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const employee = await EmployeeService.createEmployee({
      name,
      position,
      department,
      status,
      joining_date,
      basic_salary
    });

    return NextResponse.json(employee, { status: 201 });
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