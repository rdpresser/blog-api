import { User } from './modules/user/user.entity.js';
import { Article } from './modules/article/article.entity.js';
import { Tag } from './modules/article/tag.entity.js';
import { EntityManager, EntityRepository, MikroORM, Options } from '@mikro-orm/postgresql';
import { TestSeeder } from './seeders/TestSeeder.js';
import config from './mikro-orm.config.js';

export interface Services {
  orm: MikroORM;
  em: EntityManager;
  article: EntityRepository<Article>;
  user: EntityRepository<User>;
  tag: EntityRepository<Tag>;
}

let cache: Services;

export async function initORM(options?: Options, migrate = true): Promise<Services> {
  if (cache) {
    return cache;
  }

  // allow overriding config options for testing
  const orm = await MikroORM.init({
    ...config,
    ...options,
  });

  if (migrate) {
    // sync the schema
    await orm.migrator.up();
  }

  await orm.seeder.seed(TestSeeder);

  // save to cache before returning
  return cache = {
    orm,
    em: orm.em,
    article: orm.em.getRepository(Article),
    user: orm.em.getRepository(User),
    tag: orm.em.getRepository(Tag),
  };
}