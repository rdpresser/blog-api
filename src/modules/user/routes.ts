import { EntityData, wrap } from '@mikro-orm/postgresql';
import { FastifyInstance } from 'fastify';
import { User } from './user.entity.js';
import { BadRequestError, getUserFromToken } from '../common/utils.js';

export async function registerUserRoutes(app: FastifyInstance) {
  // register new user
  app.post<{ Body: EntityData<User> }>('/sign-up', async request => {

    if (!request.body.email || !request.body.fullName || !request.body.password) {
      throw new BadRequestError('One of required fields is missing: email, fullName, password');
    }

    if (await request.userRepository.exists(request.body.email)) {
      throw new BadRequestError('This email is already registered, maybe you want to sign in?');
    }

    const user = new User(request.body.fullName, request.body.email, request.body.password);
    user.bio = request.body.bio ?? '';
    await request.em.persist(user).flush();

    user.token = app.jwt.sign({ id: user.id });

    // after flush, we have the `user.id` set
    console.log(`User ${user.id} created`);

    return user;
  });

  // login existing user
  app.post<{ Body: { email: string; password: string } }>('/sign-in', async request => {
    const { email, password } = request.body as { email: string; password: string };
    
    if (!email || !password) {
      throw new BadRequestError('Email and password are required');
    }

    const user = await request.userRepository.login(email, password);

    user.token = app.jwt.sign({ id: user.id });

    return user;
  });

  app.get('/profile', async request => {
    const user = getUserFromToken(request);
    return user;
  });

  app.patch('/profile', async request => {
    const user = getUserFromToken(request);
    wrap(user).assign(request.body as User);
    await request.em.flush();
    return user;
  });
}
