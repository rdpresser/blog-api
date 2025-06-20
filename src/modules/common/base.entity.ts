import { Entity, OptionalProps, PrimaryKey, Property, t } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

@Entity( { abstract: true, discriminatorValue: 'base' })
export abstract class BaseEntity<Optional = never> {    
    [OptionalProps]?: 'createdAt' | 'updatedAt' | Optional;

    @PrimaryKey({ type: t.uuid })
    id: string = uuid();

    @Property({ hidden: true, type: t.date })
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date(), hidden: true, nullable: true, type: t.date,  })
    updatedAt?: Date;
}