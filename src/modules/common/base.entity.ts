import { OptionalProps, PrimaryKey, Property, t } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

export abstract class BaseEntity<Optional = never> {    
    [OptionalProps]?: 'createdAt' | 'updatedAt' | Optional;

    @PrimaryKey({ type: t.uuid })
    id: string = uuid();

    @Property({ type: t.date })
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date(), nullable: true, type: t.date,  })
    updatedAt?: Date;
}