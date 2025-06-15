import { MikroORM } from '@mikro-orm/postgresql';
import config from './mikro-orm.config.js';
import { User } from './modules/user/user.entity.js';

const orm = await MikroORM.init(config);

// recreate the database schema
await orm.schema.refreshDatabase();

// create new user entity instance
const user = new User();
user.email = 'foo@bar.com';
user.fullName = 'Foo Bar';
user.password = '123456';

// first mark the entity with `persist()`, then `flush()`
await orm.em.persist(user).flush();

// after the entity is flushed, it becomes managed, and has the PK available
console.log('user id is:', user.id);