import { RequestContext } from '@mikro-orm/core';
import { fastify } from 'fastify';
import { initORM } from './db.js';

export async function bootstrap(port = 3000, host = '0.0.0.0', migrate = true) {
  const db = await initORM({}, migrate);
  const app = fastify();

  // register request context hook
  app.addHook('onRequest', (request, reply, done) => {
    RequestContext.create(db.em, done);
  });

  // shut down the connection when closing the app
  app.addHook('onClose', async () => {
    await db.orm.close();
  });

  // register routes here
  app.get('/article', async request => {
    const { limit, offset } = request.query as { limit?: number; offset?: number };
    const [items, total] = await db.article.findAndCount({}, {
      limit, offset,
    });

    return { items, total };
  });

  const url = await app.listen({ port, host });

  return { app, url };
}