import type { EntityManager } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';
import { User } from '../modules/user/user.entity.js';
import { faker } from '@faker-js/faker';
import { v4 as uuid } from 'uuid';

export class TestSeeder extends Seeder {

  async run(em: EntityManager): Promise<void> {

    const userCount = await em.count(User);
    if (userCount >= 100) {
      return; // Already seeded, nothing to do
    }

    for (let i = 0; i < 100; i++) {
      const user = em.create(User, {
        fullName: faker.person.fullName().slice(0, 255), // Limit to 255 characters
        email: faker.internet.email().slice(0, 255), // Limit to 255 characters
        password: faker.internet.password().slice(0, 255), // Limit to 255 characters
        articles: [
          {
            title: faker.lorem.text().slice(0, 255), // Limit to 255 characters
            description: faker.lorem.sentence().slice(0, 1000), // Limit to 1000 characters
            text: faker.lorem.sentence().slice(0, 255), // Limit to 255 characters
            tags: [
              { name: faker.lorem.word().slice(0, 255) },
              { name: faker.lorem.word().slice(0, 255) }
            ],
          },
          {
            title: faker.lorem.text().slice(0, 255),
            description: faker.lorem.sentence().slice(0, 1000),
            text: faker.lorem.sentence().slice(0, 255),
            tags: [
              { name: faker.lorem.word().slice(0, 255) }
            ],
          },
          {
            title: faker.lorem.text().slice(0, 255),
            description: faker.lorem.sentence().slice(0, 1000),
            text: faker.lorem.sentence().slice(0, 255),
            tags: [
              { name: faker.lorem.word().slice(0, 255) },
              { name: faker.lorem.word().slice(0, 255) }
            ],
          },
        ],
      });
    }
  }
}