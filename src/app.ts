import './modules/common/fastify.module.js';
import { fastify } from 'fastify';
import ormPlugin from './modules/common/orm.plugin.js';
import { initORM } from './db.js';
import { registerArticleRoutes } from './modules/article/routes.js';
import { registerUserRoutes } from './modules/user/routes.js';

export async function bootstrap(port = 3000, host = '0.0.0.0', migrate = true) {
  const db = await initORM({}, migrate);
  const app = fastify();

  await app.register(ormPlugin, { orm: db });
  await app.register(registerArticleRoutes, { prefix: 'article' });
  await app.register(registerUserRoutes, { prefix: 'user' });

  const url = await app.listen({ port, host });
  return { app, url };
}