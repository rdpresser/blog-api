import { Migration } from '@mikro-orm/migrations';

export class Migration20250617144057_Initial_Migration extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "tag" ("id" uuid not null, "created_at" date not null, "updated_at" date null, "name" varchar(20) not null, constraint "tag_pkey" primary key ("id"));`);

    this.addSql(`create table "user" ("id" uuid not null, "created_at" date not null, "updated_at" date null, "full_name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "bio" text not null default '', constraint "user_pkey" primary key ("id"));`);

    this.addSql(`create table "article" ("id" uuid not null, "created_at" date not null, "updated_at" date null, "slug" varchar(255) not null, "title" varchar(255) not null, "description" varchar(1000) not null, "text" text not null, "author_id" uuid not null, constraint "article_pkey" primary key ("id"));`);
    this.addSql(`alter table "article" add constraint "article_slug_unique" unique ("slug");`);
    this.addSql(`create index "article_title_index" on "article" ("title");`);

    this.addSql(`create table "article_tags" ("article_id" uuid not null, "tag_id" uuid not null, constraint "article_tags_pkey" primary key ("article_id", "tag_id"));`);

    this.addSql(`alter table "article" add constraint "article_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "article_tags" add constraint "article_tags_article_id_foreign" foreign key ("article_id") references "article" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "article_tags" add constraint "article_tags_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "article_tags" drop constraint "article_tags_tag_id_foreign";`);

    this.addSql(`alter table "article" drop constraint "article_author_id_foreign";`);

    this.addSql(`alter table "article_tags" drop constraint "article_tags_article_id_foreign";`);

    this.addSql(`drop table if exists "tag" cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "article" cascade;`);

    this.addSql(`drop table if exists "article_tags" cascade;`);
  }

}
