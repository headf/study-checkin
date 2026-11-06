import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getTodayString } from '@/lib/constants';

export async function GET() {
  try {
    const today = getTodayString();
    const users = await prisma.user.findMany({
      orderBy: { id: 'asc' },
      include: {
        records: { where: { date: today } },
        screenshots: {
          where: { date: today },
          select: { id: true, filename: true, createdAt: true },
        },
      },
    });

    const result = users.map((u) => ({
      ...u,
      todayRecord: u.records[0] || null,
      todayScreenshots: u.screenshots,
    }));

    return NextResponse.json({ date: today, users: result });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
