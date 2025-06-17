import { defineConfig, Options, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SeedManager } from '@mikro-orm/seeder';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Migrator, TSMigrationGenerator } from '@mikro-orm/migrations';

const options = {} as Options;

export default defineConfig({
  driver: PostgreSqlDriver,
  dbName: 'blogapi_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 54322,
  // folder-based discovery setup, using common filename suffix
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  // we will use the ts-morph reflection, an alternative to the default reflect-metadata provider
  // check the documentation for their differences: https://mikro-orm.io/docs/metadata-providers
  metadataProvider: TsMorphMetadataProvider,
  // enable debug mode to log SQL queries and discovery information
  debug: true,
  serialization: { forceObject: true },
  dynamicImportProvider: id => import(id),
  // for highlighting the SQL queries
  highlighter: new SqlHighlighter(),
  extensions: [SeedManager, Migrator],
  migrations: {
    path: 'dist/migrations', // path to the folder with migrations
    pathTs: 'src/migrations', // path to the folder with TypeScript migrations
    //transactional: true, // wrap each migration in a transaction
    allOrNothing: true, // if one migration fails, all will be rolled back
    //snapshot: true, // create a snapshot before running migrations
    emit: 'ts',
    generator: TSMigrationGenerator,
    fileName: (timestamp: string, name?: string) => {
      // force user to provide the name, otherwise you would end up with `Migration20230421212713_undefined`
      if (!name) {
        throw new Error('Specify migration name via `mikro-orm-esm migration:create --name=...`');
      }

      return `Migration${timestamp}_${name}`;
    },
  },
  ...options,
});