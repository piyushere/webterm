import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import machinesRouter from './router/machines';
import logger from 'morgan';

const app = express();

app.use(express.json());
app.use(logger('common'));
app.use('/api/machines', machinesRouter);

// Serve static files from the public directory
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(express.static(path.join(__dirname, '../public')));

export default app;
