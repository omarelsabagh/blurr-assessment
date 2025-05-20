import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const count = await prisma.employee.count({
      where: {
        status: 'Active'
      }
    });
    
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching active employee count:', error);
    return NextResponse.json({ error: 'Failed to fetch active employee count' }, { status: 500 });
  }
} 