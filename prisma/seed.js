const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding...');

  const u1 = await prisma.user.upsert({
    where: { name: 'user1' }, update: {},
    create: { name: 'user1', nickname: '他', avatar: '🧑‍💻', color: 'his' },
  });
  const u2 = await prisma.user.upsert({
    where: { name: 'user2' }, update: {},
    create: { name: 'user2', nickname: '她', avatar: '👩‍💻', color: 'hers' },
  });
  console.log(`✅ 用户: ${u1.nickname} & ${u2.nickname}`);

  await prisma.setting.upsert({ where: { key: 'pk_start' }, update: { value: '2026-07-01' }, create: { key: 'pk_start', value: '2026-07-01' } });
  await prisma.setting.upsert({ where: { key: 'pk_end' }, update: { value: '2026-08-31' }, create: { key: 'pk_end', value: '2026-08-31' } });
  console.log('✅ PK时间: 2026-07-01 ~ 2026-08-31');

  const now = new Date();
  const bj = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  const today = bj.toISOString().split('T')[0];
  await prisma.dailyRecord.upsert({
    where: { userId_date: { userId: u1.id, date: today } }, update: {},
    create: { userId: u1.id, date: today, studyHours: 6.5, words: 85, notes: '高数 + 英语阅读' },
  });
  await prisma.dailyRecord.upsert({
    where: { userId_date: { userId: u2.id, date: today } }, update: {},
    create: { userId: u2.id, date: today, studyHours: 7.0, words: 60, notes: '政治 + 408数据结构' },
  });
  console.log(`✅ 示例数据 (${today})`);
}

main().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect(); });
