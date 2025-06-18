import { FastifyInstance } from 'fastify';

export async function registerArticleRoutes(app: FastifyInstance) {
  app.get('/', async request => {
    const { limit, offset } = request.query as { limit?: number; offset?: number };
    const [items, total] = await request.article.findAndCount({}, {
      limit, offset,
    });

    return { items, total };
  });
}