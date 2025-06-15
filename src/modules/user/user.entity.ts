import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

@Entity()
export class User {

   @PrimaryKey({ type: 'uuid' })
   id: string = uuid();

   @Property()
   fullName!: string;

   @Property()
   email!: string;

   @Property()
   password!: string;

   @Property({ type: 'text', length: 1000 })
   bio: string = '';
}