import { BeforeCreate, BeforeUpdate, Collection, Entity, EntityRepositoryType, EventArgs, OneToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from '../common/base.entity.js';
import { Article } from '../article/article.entity.js';
import { hash, verify } from 'argon2';
import { UserRepository } from './user.repository.js';

@Entity({ repository: () => UserRepository })
export class User extends BaseEntity<'bio'> {

  // for automatic inference via `em.getRepository(User)`
   [EntityRepositoryType]?: UserRepository;

   @Property()
   fullName!: string;

   @Property()
   email!: string;

   @Property({ hidden: true, lazy: true })
   password: string;

   @Property({ type: 'text' })
   bio: string = '';

  @OneToMany({ mappedBy: 'author' })
  articles = new Collection<Article>(this);

   constructor(fullName: string, email: string, password: string) {
    super();
    this.fullName = fullName;
    this.email = email;
    this.password = password; // keep plain text, will be hashed via hooks
  }

  @BeforeCreate()
  @BeforeUpdate()
  async hashPassword(args: EventArgs<User>) {
    // hash only if the password was changed
    const password = args.changeSet?.payload.password;

    if (password) {
      this.password = await hash(password);
    }
  }

  async verifyPassword(password: string) {
    return await verify(this.password, password);
  }
}