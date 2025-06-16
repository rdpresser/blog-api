import { User } from './modules/user/user.entity.js';
import { Article } from './modules/article/article.entity.js';
import { Tag } from './modules/article/tag.entity.js';
import { EntityManager, EntityRepository, MikroORM, Options } from '@mikro-orm/postgresql';

export interface Services {
  orm: MikroORM;
  em: EntityManager;
  article: EntityRepository<Article>;
  user: EntityRepository<User>;
  tag: EntityRepository<Tag>;
}

let cache: Services;

export async function initORM(options?: Options): Promise<Services> {
  if (cache) {
    return cache;
  }

  const orm = await MikroORM.init(options);

  if (options?.dbName === ':memory:') {
    await orm.schema.refreshDatabase();
  } else {
    // create the schema so we can use the database -- Future versions, change to call migrations instead
    if (!await orm.schema.ensureDatabase()) {
      // If schema does not exist, create it from scratch
      await orm.schema.createSchema();
    } else {
      // If schema exists, check for pending updates and apply them
      const pendingUpdates = await orm.schema.getUpdateSchemaSQL();
      if (pendingUpdates && pendingUpdates.trim().length > 0) {
        await orm.schema.updateSchema();
      }
    }
  }

  // save to cache before returning
  return cache = {
    orm,
    em: orm.em,
    article: orm.em.getRepository(Article),
    user: orm.em.getRepository(User),
    tag: orm.em.getRepository(Tag),
  };
}