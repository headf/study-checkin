import { addClient } from '@/lib/events';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req) {
  const stream = new ReadableStream({
    start(controller) {
      const cleanup = addClient(controller);

      // 心跳保活
      const heartbeat = setInterval(() => {
        try { controller.enqueue(new TextEncoder().encode(': heartbeat\n\n')); }
        catch { clearInterval(heartbeat); }
      }, 15000);

      req.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        cleanup();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
