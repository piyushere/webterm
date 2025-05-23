import { createServer } from 'http';
import app from './app';
import { config } from 'dotenv';
import { configureWebSocketChannels } from './socket';

// Load only variables from .env file, not system variables
process.env = config({ processEnv: {} }).parsed || {};

const httpServer = createServer(app);
const websocketServer = configureWebSocketChannels(httpServer);
app.set('wsServer', websocketServer);

const port = process.env.PORT || 8000;
httpServer.listen(port, () =>
  console.log(`Application running on port ${port}`)
);
