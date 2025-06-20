import { FastifyPluginAsync } from 'fastify';
import { MikroORM, NotFoundError } from '@mikro-orm/core';
import { Article } from '../article/article.entity.js';
import { User } from '../user/user.entity.js';
import { Comment } from '../article/comment.entity.js';
import { Tag } from '../article/tag.entity.js';
import fp from 'fastify-plugin';
import { AuthError, BadRequestError } from './utils.js';

const ormPlugin: FastifyPluginAsync<{ orm: MikroORM }> = async (fastify, opts) => {
  fastify.decorate('orm', opts.orm);
  
  fastify.decorateRequest('em', null as any);
  fastify.decorateRequest('articleRepository', null as any);
  fastify.decorateRequest('userRepository', null as any);
  fastify.decorateRequest('commentRepository', null as any);
  fastify.decorateRequest('tagRepository', null as any);

  fastify.addHook('onRequest', async (request, reply) => {
    if (!request.em) {
      const em = opts.orm.em.fork();

      request.em = em;
      request.articleRepository = em.getRepository(Article);
      request.userRepository = em.getRepository(User);
      request.commentRepository = em.getRepository(Comment);
      request.tagRepository = em.getRepository(Tag);
    }
  });

  fastify.addHook('onRequest', async request => {
    try {
      const ret = await request.jwtVerify<{ id: string }>();
      request.user = await request.userRepository.findOneOrFail(ret.id);
    } catch (e) {
      fastify.log.error(e);
      // ignore token errors, we validate the request.user exists only where needed
    }
  });

  // register global error handler to process 404 errors from `findOneOrFail` calls
  fastify.setErrorHandler((error, request, reply) => {
    if (error instanceof AuthError) {
      return reply.status(401).send({ error: error.message });
    }

    if (error instanceof BadRequestError) {
      return reply.status(400).send({ error: error.message });
    }

    // we also handle not found errors automatically
    // `NotFoundError` is an error thrown by the ORM via `em.findOneOrFail()` method
    if (error instanceof NotFoundError) {
      return reply.status(404).send({ error: error.message });
    }

    fastify.log.error(error);
    reply.status(500).send({ error: error.message });
  });

  fastify.addHook('onClose', async () => {
    await opts.orm.close();
  });
};

export default fp(ormPlugin);