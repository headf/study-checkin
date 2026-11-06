import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 获取所有用户
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: 'asc' },
    });
    return NextResponse.json({ users });
  } catch (error) {
    console.error('获取用户失败:', error);
    return NextResponse.json({ error: '获取用户失败' }, { status: 500 });
  }
}

// 更新用户信息
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, nickname, avatar, color } = body;

    if (!id) {
      return NextResponse.json({ error: '缺少用户ID' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(nickname && { nickname }),
        ...(avatar && { avatar }),
        ...(color && { color }),
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('更新用户失败:', error);
    return NextResponse.json({ error: '更新用户失败' }, { status: 500 });
  }
}
