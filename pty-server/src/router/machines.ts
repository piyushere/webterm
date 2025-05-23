import { Router } from 'express';
import { WebSocketServer } from 'ws';
import { randomUUID } from 'crypto';

export const terminalSessions = new Map<string, any>();
const machines = Router();

machines.get('/create', (req, res) => {
  if (!req.query) {
    res.status(400).json({
      success: false,
      message: 'rows and cols are required',
    });
    return;
  }
  const rows = parseInt(req.query.rows as string);
  const cols = parseInt(req.query.cols as string);

  const machineId = randomUUID();
  terminalSessions.set(machineId, {
    rows,
    cols,
    instance: null,
  });

  res.status(201).json({
    machineId,
    data: { rows, cols },
    message: 'machine has been registered successfully',
  });
});

machines.get('/:machineId/resize', (req, res) => {
  if (!req.query) {
    res.status(400).json({
      success: false,
      message: 'rows and cols are required',
    });
    return;
  }

  const machineId = req.params.machineId;
  const cols = parseInt(req.query.cols as string);
  const rows = parseInt(req.query.rows as string);

  const { instance } = terminalSessions.get(machineId);
  if (instance) instance.resize(cols, rows);
  else
    res.status(404).json({
      message: 'machine not found!',
    });
  res.end();
});

// Add more routes as needed
machines.get('/status', (req, res) => {
  // Get count of connected clients
  const wsServer = req.app.get('wsServer') as WebSocketServer;
  const connectedClients = wsServer?.clients.size || -1;

  res.status(200).json({
    success: true,
    connectedClients,
    path: '/machines',
  });
});

export default machines;
