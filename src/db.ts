import { MikroORM, Options } from '@mikro-orm/postgresql';
import config from './mikro-orm.config.js';

let orm: MikroORM | undefined;

export async function initORM(options?: Options, migrate = true): Promise<MikroORM> {
  if (orm) return orm;

  orm = await MikroORM.init({
    ...config,
    ...options,
  });

  if (migrate) {
    await orm.migrator.up();
  }

  await orm.seeder.seed(); 

  return orm;
}