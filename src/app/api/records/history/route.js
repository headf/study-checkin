import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calcScore } from '@/lib/constants';

export async function GET() {
  try {
    const users = await prisma.user.findMany({ orderBy: { id: 'asc' } });
    if (users.length < 2) return NextResponse.json({ error: 'Need 2 users' }, { status: 400 });

    const dates = await prisma.dailyRecord.findMany({
      select: { date: true },
      distinct: ['date'],
      orderBy: { date: 'desc' },
      take: 30,
    });

    const history = [];

    for (const { date } of dates) {
      const records = await prisma.dailyRecord.findMany({
        where: { date },
        include: { user: { select: { id: true, nickname: true, avatar: true, color: true } } },
      });

      if (records.length >= 2) {
        const r1 = records.find((r) => r.userId === users[0].id);
        const r2 = records.find((r) => r.userId === users[1].id);
        if (r1 && r2) {
          const s1 = calcScore(r1);
          const s2 = calcScore(r2);
          history.push({
            date,
            user1: { id: r1.user.id, nickname: r1.user.nickname, avatar: r1.user.avatar, color: r1.user.color, score: s1, hours: r1.studyHours, words: r1.words },
            user2: { id: r2.user.id, nickname: r2.user.nickname, avatar: r2.user.avatar, color: r2.user.color, score: s2, hours: r2.studyHours, words: r2.words },
            winner: s1 > s2 ? users[0].id : s2 > s1 ? users[1].id : null,
          });
        }
      }
    }

    const winCount1 = history.filter((h) => h.winner === users[0].id).length;
    const winCount2 = history.filter((h) => h.winner === users[1].id).length;
    const drawCount = history.filter((h) => h.winner === null).length;

    return NextResponse.json({
      history,
      stats: {
        user1: { id: users[0].id, wins: winCount1 },
        user2: { id: users[1].id, wins: winCount2 },
        draws: drawCount,
        total: history.length,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
