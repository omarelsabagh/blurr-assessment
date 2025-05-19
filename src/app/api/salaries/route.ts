import { NextRequest, NextResponse } from 'next/server';
import { SalaryService } from '@/services/salary.service';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
  const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString());

  try {
    const records = await SalaryService.getSalaryRecords(year, month);
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
    const { employee_id, year, month, bonus, deductible } = data;

    if (!employee_id || !year || !month) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await SalaryService.updateSalaryRecord({
      employee_id,
      year,
      month,
      bonus,
      deductible
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating salary record:', error);
    return NextResponse.json(
      { error: 'Failed to update salary record', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 