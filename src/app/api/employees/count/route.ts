import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const result = await prisma.$queryRaw<[{ count: number }]>`
      SELECT COUNT(*) as count
      FROM Employee
      WHERE status = 'Active'
    `;
    
    return NextResponse.json({ count: result[0].count });
  } catch (error) {
    console.error('Error fetching active employee count:', error);
    return NextResponse.json({ error: 'Failed to fetch active employee count' }, { status: 500 });
  }
} 