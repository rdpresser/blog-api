//import './modules/common/fastify.module.js';
import { fastify } from 'fastify';
import fastifyJWT from '@fastify/jwt';
import ormPlugin from './modules/common/orm.plugin.js';
import { initORM } from './db.js';
import { registerArticleRoutes } from './modules/article/routes.js';
import { registerUserRoutes } from './modules/user/routes.js';

export async function bootstrap(port = 3000, host = '0.0.0.0', migrate = true) {
  const db = await initORM({}, migrate);
  const app = fastify();

  app.register(fastifyJWT, {
    secret: process.env.JWT_SECRET || 'default_secret|1234567890',
    sign: {
      expiresIn: '1d',
    },
  });

  await app.register(ormPlugin, { orm: db });
  await app.register(registerArticleRoutes, { prefix: 'article' });
  await app.register(registerUserRoutes, { prefix: 'user' });

  const url = await app.listen({ port, host });
  return { app, url };
}