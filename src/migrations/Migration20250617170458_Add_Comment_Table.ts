import { Migration } from '@mikro-orm/migrations';

export class Migration20250617170458_Add_Comment_Table extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "comment" ("id" uuid not null, "created_at" date not null, "updated_at" date null, "text" varchar(1000) not null, "article_id" uuid not null, "author_id" uuid not null, constraint "comment_pkey" primary key ("id"));`);

    this.addSql(`alter table "comment" add constraint "comment_article_id_foreign" foreign key ("article_id") references "article" ("id") on update cascade;`);
    this.addSql(`alter table "comment" add constraint "comment_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "comment" cascade;`);
  }

}
