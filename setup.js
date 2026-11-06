const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const AVATARS = ['🧑‍💻', '👩‍💻', '🦊', '🐱', '🐼', '🦁', '🐯', '🐰', '🐨', '🐙', '🌸', '⭐', '🔥', '💪', '🎯', '🚀'];

function ask(q) {
  return new Promise((r) => rl.question(q, (a) => r(a.trim())));
}

async function main() {
  console.log('\n┌─────────────────────────────┐');
  console.log('│   学习打卡 · 设置向导       │');
  console.log('└─────────────────────────────┘\n');

  const existing = await prisma.user.findMany();
  if (existing.length > 0) {
    existing.forEach((u) => console.log(`  ${u.avatar} ${u.nickname}`));
    const ans = await ask('\n重新设置？(y/n): ');
    if (ans.toLowerCase() !== 'y') { console.log('\n保持不变。\n'); rl.close(); return; }
  }

  await prisma.screenshot.deleteMany();
  await prisma.dailyRecord.deleteMany();
  await prisma.user.deleteMany();

  console.log('\n--- 第一位（他）---');
  const n1 = await ask('昵称: ') || '他';
  AVATARS.forEach((a, i) => process.stdout.write(`${i + 1}.${a} `));
  console.log();
  const ai1 = Math.min(Math.max(parseInt(await ask('头像编号 (默认1): ')) || 1, 1), 16);
  const u1 = await prisma.user.create({ data: { name: 'user1', nickname: n1, avatar: AVATARS[ai1 - 1], color: 'his' } });
  console.log(`✅ ${u1.avatar} ${u1.nickname}\n`);

  console.log('--- 第二位（她）---');
  const n2 = await ask('昵称: ') || '她';
  AVATARS.forEach((a, i) => process.stdout.write(`${i + 1}.${a} `));
  console.log();
  const ai2 = Math.min(Math.max(parseInt(await ask('头像编号 (默认2): ')) || 2, 1), 16);
  const u2 = await prisma.user.create({ data: { name: 'user2', nickname: n2, avatar: AVATARS[ai2 - 1], color: 'hers' } });
  console.log(`✅ ${u2.avatar} ${u2.nickname}\n`);

  const ans = await ask('创建今日示例数据？(y/n): ');
  if (ans.toLowerCase() === 'y') {
    const now = new Date();
    const bj = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    const today = bj.toISOString().split('T')[0];
    await prisma.dailyRecord.create({ data: { userId: u1.id, date: today, studyHours: 6.5, words: 85, notes: '高数 + 英语阅读' } });
    await prisma.dailyRecord.create({ data: { userId: u2.id, date: today, studyHours: 7.0, words: 60, notes: '政治 + 408数据结构' } });
    console.log('✅ 已创建\n');
  }

  console.log('🎉 设置完成！运行 npm run dev 启动\n');
  rl.close();
}

main().then(() => prisma.$disconnect()).catch((e) => { console.error(e); prisma.$disconnect(); });
