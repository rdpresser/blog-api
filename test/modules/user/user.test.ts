import { UserRepository } from './../../../src/modules/user/user.repository';
import { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, expect, test } from 'vitest';
import { initTestApp } from '../../common/utils.js';
import { EntityManager, MikroORM } from '@mikro-orm/postgresql';
import { User } from '../../../src/modules/user/user.entity.js';

let app: FastifyInstance;
let orm: MikroORM
let em: EntityManager;

beforeAll(async () => {
  // we use different ports to allow parallel testing
  ({ app, orm } = await initTestApp(30002, '0.0.0.0', true));
  em = orm.em.fork();
});

afterAll(async () => {
  // we close only the fastify app - it will close the database connection via onClose hook automatically
  await app.close();
});

test('login', async () => {
    const userRepository = em.getRepository(User);
    const exists = await userRepository.exists('foo@bar.com');
    if (exists) {
        await userRepository.nativeDelete({ email: 'foo@bar.com' });
    }

    const user = em.create(User,
    {
        email: 'foo@bar.com',
        fullName: 'Foo Bar',
        password: 'password123',
    });
    await em.flush();

    const res1 = await app.inject({
        method: 'post',
        url: '/user/sign-in',
        payload: {
        email: 'foo@bar.com',
        password: 'password123',
        },
    });

    expect(res1.statusCode).toBe(200);
    expect(res1.json()).toMatchObject({
        fullName: 'Foo Bar',
    });

    const res2 = await app.inject({
        method: 'post',
        url: '/user/sign-in',
        payload: {
        email: 'foo@bar.com',
        password: 'password456',
        },
    });

    expect(res2.statusCode).toBe(401);
    expect(res2.json()).toMatchObject({ message: 'Invalid combination of email and password' });
});