/**
 * 简单的 SSE 事件管理器
 * 用于实时推送打卡更新
 */

const clients = new Set();

export function addClient(controller) {
  clients.add(controller);
  return () => {
    clients.delete(controller);
  };
}

export function broadcast(event, data) {
  const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  clients.forEach((controller) => {
    try {
      controller.enqueue(new TextEncoder().encode(message));
    } catch {
      clients.delete(controller);
    }
  });
}
