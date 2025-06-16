import { bootstrap } from '../../src/app.js';
import { initORM } from '../../src/db.js';
import config from '../../src/mikro-orm.config.js';

export async function initTestApp(port: number, host: string = '0.0.0.0') {
  // this will create all the ORM services and cache them
  const { orm } = await initORM({
    // first, include the main config
    ...config,
    // no need for debug information, it would only pollute the logs
    debug: false,
    // we will use in-memory database, this way we can easily parallelize our tests
    dbName: ':memory:',
    connect: false, // we will not connect to the database, as it is in-memory
    // this will ensure the ORM discovers TS entities, with ts-node, ts-jest and vitest
    // it will be inferred automatically, but we are using vitest here
    // preferTs: true,
  });

  const { app } = await bootstrap(port, host);

  return app;
}