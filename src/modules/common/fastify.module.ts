import 'fastify';
import { UserRepository } from '../user/user.repository.js';
import { EntityManager, EntityRepository, MikroORM } from '@mikro-orm/core';
import { Article } from '../../modules/article/article.entity.js';
import { Tag } from '../../modules/article/tag.entity.js';
import { Comment } from '../../modules/article/comment.entity.js';

declare module 'fastify' {
  interface FastifyInstance {
    orm: MikroORM;
  }

  interface FastifyRequest {
    em: EntityManager;
    article: EntityRepository<Article>;
    user: UserRepository;
    comment: EntityRepository<Comment>;
    tag: EntityRepository<Tag>;
  }
}
