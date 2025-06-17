import { bootstrap } from '../../src/app.js';
import { initORM } from '../../src/db.js';

export async function initTestApp(port: number, host: string = '0.0.0.0', migrate = false) {
  // this will create all the ORM services and cache them
  const { orm } = await initORM({
    // no need for debug information, it would only pollute the logs
    debug: false,
    // we will use in-memory database, this way we can easily parallelize our tests
    dbName: ':memory:',
    connect: false, // we will not connect to the database, as it is in-memory
    // this will ensure the ORM discovers TS entities, with ts-node, ts-jest and vitest
    // it will be inferred automatically, but we are using vitest here
    // preferTs: true,
  },
    migrate
  );

  orm.schema.refreshDatabase();
  
  const { app } = await bootstrap(port, host, migrate);

  return app;
}