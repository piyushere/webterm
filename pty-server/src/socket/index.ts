import { Server as HttpServer } from 'http';
import { WebSocketServer } from 'ws';
import { URL } from 'url';
import machinesSocketHandler from './machines';

/**
 * Configures WebSocket Server with pathname based channels
 * @param httpServer The HTTP server to attach WebSockets to
 * @returns websocket server instance
 */
export function configureWebSocketChannels(httpServer: HttpServer) {
  const wsServer = new WebSocketServer({ server: httpServer });

  wsServer.on('connection', (webSocket, request) => {
    webSocket.on('error', console.log);
    const pathname = new URL(
      request.url || '',
      `http://${request.headers.host}`
    ).pathname;

    const [_, path, machineId] = pathname.split('/').filter((x) => Boolean(x));
    if (path === 'machines' && machineId) {
      machinesSocketHandler(webSocket, machineId);
    } else webSocket.close();
  });

  return wsServer;
}
