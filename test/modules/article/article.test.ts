import { afterAll, beforeAll, expect, test } from 'vitest';
import { FastifyInstance } from 'fastify';
import { initTestApp } from '../../common/utils.js';

let app: FastifyInstance;

beforeAll(async () => {
  // we use different ports to allow parallel testing
  app = await initTestApp(30001, '0.0.0.0', true);
});

afterAll(async () => {
  // we close only the fastify app - it will close the database connection via onClose hook automatically
  await app.close();
});

test('list all articles', async () => {
  // mimic the http request via `app.inject()`
  const res = await app.inject({
    method: 'get',
    url: '/article',
  });

  // assert it was successful response
  expect(res.statusCode).toBe(200);

  // with expected shape
  const data = res.json();
  expect(data).toMatchObject({
    items: expect.any(Array),
    total: expect.any(Number),
  });

  expect(data.items.length).toBeGreaterThan(0);
  expect(data.total).toBeGreaterThan(0);

});