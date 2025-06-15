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

// fork first to have a separate context
const em = orm.em.fork();

// first mark the entity with `persist()`, then `flush()`
await em.persist(user).flush();

// after the entity is flushed, it becomes managed, and has the PK available
console.log('user id is:', user.id);

// user entity is now managed, if we try to find it again, we get the same reference
const myUser = await em.findOne(User, user.id);
console.log('users are the same?', user === myUser);

// modifying the user and flushing yields update queries
user.bio = '...';
await em.flush();

// now try to create a new fork, does not matter if from `orm.em` or our existing `em` fork, as by default we get a clean one
const em2 = em.fork();
console.log('verify the EM ids are different:', em.id, em2.id);
const myUser2 = await em2.findOneOrFail(User, user.id);
console.log(
  'users are no longer the same, as they came from differnet EM:',
  user === myUser2
);

// change the user
myUser2.bio = 'changed';

// reload user with `em.refresh()`
await em2.refresh(myUser2);
console.log('changes are lost', myUser2);

// let's try again
myUser2!.bio = 'some change, will be saved';
await em2.flush();

// finally, remove the entity
//await em2.remove(myUser2).flush();

// close the ORM, otherwise the process would keep going indefinitely
await orm.close();
