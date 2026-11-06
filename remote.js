/**
 * 📡 远程访问启动器
 *
 * 用法: node remote.js
 *
 * 会在终端输出一个公网链接
 * 你和女朋友不连同一个WiFi也能用
 */

const { spawn, execSync } = require('child_process');
const http = require('http');

const PORT = 3000;

function checkPort(port) {
  return new Promise((resolve) => {
    const server = http.createServer();
    server.listen(port, () => { server.close(); resolve(true); });
    server.on('error', () => resolve(false));
  });
}

async function main() {
  console.log('\n┌───────────────────────────────────────┐');
  console.log('│     📡 远程访问启动器                 │');
  console.log('│     你和手机/TA不需要同一WiFi         │');
  console.log('└───────────────────────────────────────┘\n');

  // 1. 检查 / 启动本地服务
  const available = await checkPort(PORT);
  if (available) {
    console.log('🚀 启动本地服务...');
    execSync(`start npx next dev -p ${PORT}`, { cwd: __dirname, shell: true });
    console.log('⏳ 等待服务就绪...\n');
    await new Promise(r => setTimeout(r, 8000));
  }
  console.log(`✅ 本地服务: http://localhost:${PORT}\n`);

  // 2. 启动 pinggy 隧道（国内访问速度快）
  console.log('🔗 创建远程链接...\n');

  const tunnel = spawn('ssh', [
    '-p', '443',
    '-o', 'StrictHostKeyChecking=no',
    '-o', 'ServerAliveInterval=30',
    '-R', `0:localhost:${PORT}`,
    'a.pinggy.io',
  ], { shell: true, cwd: __dirname });

  tunnel.stdout.on('data', (data) => {
    const text = data.toString();
    const matches = text.match(/https?:\/\/[^\s]+/g);
    if (matches && matches.length > 0) {
      const httpsUrl = matches.find(u => u.startsWith('https'));
      const httpUrl = matches.find(u => u.startsWith('http://'));
      console.log(`\n╔══════════════════════════════════════════════╗`);
      console.log(`║  🎉 远程访问地址                            ║`);
      console.log(`║                                             ║`);
      if (httpsUrl) {
        console.log(`║  📱 推荐(更快): ${httpUrl || ''}  ║`);
        console.log(`║  🔒 备选: ${httpsUrl}  ║`);
      } else if (httpUrl) {
        console.log(`║  ${httpUrl}  ║`);
      }
      console.log(`║                                             ║`);
      console.log(`║  手机浏览器打开 → 就能用 🚀                ║`);
      console.log(`║  TA也能同时访问，实时同步                  ║`);
      console.log(`║                                             ║`);
      console.log(`║  ⏳ 此链接60分钟后失效，届时重新运行即可     ║`);
      console.log(`╚══════════════════════════════════════════════╝\n`);
    }
  });

  tunnel.stderr.on('data', (data) => {
    const text = data.toString();
    if (text.includes('Warning') || text.includes('Pseudo') || text.includes('WARNING')) return;
    const matches = text.match(/https?:\/\/[^\s]+/g);
    if (matches && matches.length > 0) {
      const httpsUrl = matches.find(u => u.startsWith('https'));
      const httpUrl = matches.find(u => u.startsWith('http://'));
      console.log(`\n╔══════════════════════════════════════════════╗`);
      console.log(`║  🎉 远程访问地址                            ║`);
      console.log(`║                                             ║`);
      if (httpUrl) {
        console.log(`║  📱 推荐(更快): ${httpUrl}  ║`);
        if (httpsUrl) console.log(`║  🔒 备选: ${httpsUrl}  ║`);
      } else if (httpsUrl) {
        console.log(`║  ${httpsUrl}  ║`);
      }
      console.log(`║                                             ║`);
      console.log(`║  手机浏览器打开 → 就能用 🚀                ║`);
      console.log(`║  TA也能同时访问，实时同步                  ║`);
      console.log(`║                                             ║`);
      console.log(`║  ⏳ 此链接60分钟后失效，届时重新运行即可     ║`);
      console.log(`╚══════════════════════════════════════════════╝\n`);
    }
  });

  tunnel.on('error', () => {
    console.log('\n❌ 隧道启动失败，试试备选方案：');
    console.log('   在新终端运行: ssh -p 443 -R0:localhost:3000 a.pinggy.io\n');
  });

  process.on('SIGINT', () => {
    console.log('\n\n👋 已关闭远程访问');
    process.exit(0);
  });

  console.log('按 Ctrl+C 停止\n');
}

main();
