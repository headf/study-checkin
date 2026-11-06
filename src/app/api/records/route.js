import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getTodayString } from '@/lib/constants';
import { broadcast } from '@/lib/events';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, date, studyHours, words, notes } = body;

    if (!userId) {
      return NextResponse.json({ error: '请选择打卡人' }, { status: 400 });
    }

    const today = date || getTodayString();

    const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
    if (!user) return NextResponse.json({ error: '用户不存在' }, { status: 404 });

    const record = await prisma.dailyRecord.upsert({
      where: { userId_date: { userId: parseInt(userId), date: today } },
      update: {
        studyHours: parseFloat(studyHours || 0),
        words: parseInt(words || 0),
        notes: notes || '',
      },
      create: {
        userId: parseInt(userId), date: today,
        studyHours: parseFloat(studyHours || 0),
        words: parseInt(words || 0),
        notes: notes || '',
      },
    });

    // 广播打卡事件给所有连接的客户端
    broadcast('checkin', { userId: parseInt(userId), date: today });

    return NextResponse.json({ record, success: true });
  } catch (error) {
    console.error('Save failed:', error);
    return NextResponse.json({ error: '保存失败' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start');
    const endDate = searchParams.get('end');
    const userId = searchParams.get('userId');

    const where = {};
    if (startDate && endDate) where.date = { gte: startDate, lte: endDate };
    if (userId) where.userId = parseInt(userId);

    const records = await prisma.dailyRecord.findMany({
      where,
      include: { user: { select: { id: true, nickname: true, avatar: true, color: true } } },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json({ records });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
