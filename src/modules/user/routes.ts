import { EntityData } from '@mikro-orm/postgresql';
import { FastifyInstance } from 'fastify';
import { User } from './user.entity.js';

export async function registerUserRoutes(app: FastifyInstance) {
  // register new user
  app.post('/sign-up', async request => {
    const body = request.body as EntityData<User>;

    if (!body.email || !body.fullName || !body.password) {
      throw new Error('One of required fields is missing: email, fullName, password');
    }

    if (await request.user.exists(body.email)) {
      throw new Error('This email is already registered, maybe you want to sign in?');
    }

    const user = new User(body.fullName, body.email, body.password);
    user.bio = body.bio ?? '';
    await request.em.persist(user).flush();

    // after flush, we have the `user.id` set
    console.log(`User ${user.id} created`);

    return user;
  });

  // login existing user
  app.post('/sign-in', async request => {
    const { email, password } = request.body as { email: string; password: string };
    const user = await request.user.findOne({ email });

    if (!user || !(await user.verifyPassword(password))) {
      throw new Error('Invalid email or password');
    }

    return user;
  });
}