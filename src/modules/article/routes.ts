import { FastifyInstance } from 'fastify';

export async function registerArticleRoutes(app: FastifyInstance) {
  app.get('/', async request => {
    const { limit, offset } = request.query as { limit?: number; offset?: number };
    const [items, total] = await request.articleRepository.findAndCount({}, {
      limit, offset,
    });

    return { items, total };
  });
}