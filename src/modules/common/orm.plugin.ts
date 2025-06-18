import { FastifyPluginAsync } from 'fastify';
import { MikroORM } from '@mikro-orm/core';
import { Article } from '../article/article.entity.js';
import { User } from '../user/user.entity.js';
import { Comment } from '../article/comment.entity.js';
import { Tag } from '../article/tag.entity.js';
import fp from 'fastify-plugin';

const ormPlugin: FastifyPluginAsync<{ orm: MikroORM }> = async (fastify, opts) => {
  fastify.decorate('orm', opts.orm);

  fastify.decorateRequest('em', null as any);
  fastify.decorateRequest('article', null as any);
  fastify.decorateRequest('user', null as any);
  fastify.decorateRequest('comment', null as any);
  fastify.decorateRequest('tag', null as any);

  fastify.addHook('onRequest', async (request, reply) => {
    if (!request.em) {
      const em = opts.orm.em.fork();

      request.em = em;
      request.article = em.getRepository(Article);
      request.user = em.getRepository(User);
      request.comment = em.getRepository(Comment);
      request.tag = em.getRepository(Tag);
    }
  });

  fastify.addHook('onClose', async () => {
    await opts.orm.close();
  });
};

export default fp(ormPlugin);