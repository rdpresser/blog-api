import dotenv from 'dotenv';
dotenv.config();

import { bootstrap }  from './app.js';

try {
  const port = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000;
  const host = process.env.SERVER_HOST || '0.0.0.0';
  const { url } = await bootstrap(port, host);
  console.log(`server started at ${url}`);
} catch (e) {
  console.error(e);
}