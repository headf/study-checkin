import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    const map = {};
    settings.forEach((s) => { map[s.key] = s.value; });
    return NextResponse.json({
      pkStart: map.pk_start || '2026-07-01',
      pkEnd: map.pk_end || '2026-08-31',
    });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const updates = [];

    if (body.pkStart) {
      updates.push(
        prisma.setting.upsert({
          where: { key: 'pk_start' },
          update: { value: body.pkStart },
          create: { key: 'pk_start', value: body.pkStart },
        })
      );
    }
    if (body.pkEnd) {
      updates.push(
        prisma.setting.upsert({
          where: { key: 'pk_end' },
          update: { value: body.pkEnd },
          create: { key: 'pk_end', value: body.pkEnd },
        })
      );
    }

    await Promise.all(updates);
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
