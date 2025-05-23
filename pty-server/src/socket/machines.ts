import { WebSocket, createWebSocketStream } from 'ws';
import { terminalSessions } from 'src/router/machines';
import { spawn } from 'node-pty';
import { PtyStream } from 'src/utils/PtyStream';

export default function machinesSocketHandler(
  ws: WebSocket,
  machineId: string
) {
  const terminalSession = terminalSessions.get(machineId);
  ws.send('Please wait while we spin up a new machine for you...\n\n\n');
  const term = spawn('zsh', [], {
    name: `xterm-256color`,
    rows: terminalSession.rows,
    cols: terminalSession.cols,
    encoding: 'utf8',
    env: process.env,
  });
  terminalSession.instance = term;
  const wsStream = createWebSocketStream(ws, { encoding: 'utf-8' });
  const terminalStream = new PtyStream(term);
  wsStream.pipe(terminalStream).pipe(wsStream);

  // when the terminal exits, exit immediately
  const termExitEventEmitter = term.onExit(() => {
    wsStream.write('goodbye...!\n');
    ws.close();
  });

  // a very raw approach
  // term.onData((data) => wsStream.write(data));
  // wsStream.on('data', term.write);

  // Handle client disconnect
  ws.on('close', () => {
    termExitEventEmitter.dispose();
    terminalSessions.delete(machineId);
    terminalStream.end();
    wsStream.end();
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
}
