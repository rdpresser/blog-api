import { LoadStrategy, MikroORM, wrap } from '@mikro-orm/postgresql';
import config from './mikro-orm.config.js';
import { User } from './modules/user/user.entity.js';
import { Article } from './modules/article/article.entity.js';
import dotenv from 'dotenv';
import { Tag } from './modules/article/tag.entity.js';

dotenv.config();

const orm = await MikroORM.init(config);

// recreate the database schema
await orm.schema.refreshDatabase();

// create new user entity instance
const user = new User('Author Foo Bar', 'foo@bar.com', '123456');
console.log(user);

// fork first to have a separate context
const em = orm.em.fork();

// first mark the entity with `persist()`, then `flush()`
await em.persist(user).flush();

// clear the context to simulate fresh request
em.clear();

// create the article instance
const article = em.create(Article, {
  title: 'Article Foo is Bar',
  text: 'Lorem impsum dolor sit amet',
  author: user.id,
  //slug: 'foo',
  //description: 'Foo is bar',
});

console.log('it really is a User', article.author instanceof User); // true
console.log('but not initialized', wrap(article.author).isInitialized()); // false

// `em.create` calls `em.persist` automatically, so flush is enough
await em.flush();
console.log(article);

// clear the context to simulate fresh request
em.clear();

// find article by id and populate its author
// const articleWithAuthor = await em.findOne(Article, article.id, {
//   populate: ['author', 'text'],
// });
// const articleWithAuthor = await em.findOne(Article, article.id, {
//   populate: ['author'],
// });
// await em.populate(articleWithAuthor!, ['text']);

const articleWithAuthor = await em.findOne(Article, article.id, {
  populate: ['author', 'text'],
  strategy: LoadStrategy.JOINED,
});
console.log(articleWithAuthor);

// clear the context to simulate fresh request
em.clear();

// populating User.articles collection
// const user2 = await em.findOneOrFail(User, user.id, { populate: ['articles'] });
// console.log(user2);

const user2 = await em.findOneOrFail(User, user.id);
console.log(user);

user2.password = 'new-password'; // change the password, it will be hashed automatically
user2.email = 'rodrigo@testes.com.br'; // change the email, it will be updated automatically
await em.flush(); // flush the changes

// or you could lazy load the collection later via `init()` method
// if (!user2.articles.isInitialized()) {
//   await user2.articles.init();
// }

// to ensure collection is loaded (but do nothing if it already is), use `loadItems()` method
await user2.articles.loadItems();

for (const article of user2.articles) {
   console.log(article.title);
   console.log(article.author.fullName); // the `article.author` is linked automatically thanks to the Identity Map
}

// create some tags and assign them to the first article
const [article2] = user2.articles;
const newTag = em.create(Tag, { name: 'new' });
const oldTag = em.create(Tag, { name: 'old' });
article2.tags.add(newTag, oldTag);
await em.flush();
console.log(article2.tags);

// to remove items from collection, we first need to initialize it, we can use `init()`, `loadItems()` or `em.populate()`
await em.populate(article2, ['tags']);

// remove 'old' tag by reference
article.tags.remove(oldTag);

// or via callback
article.tags.remove(t => t.id === oldTag.id);

// close the ORM, otherwise the process would keep going indefinitely
await orm.close();
