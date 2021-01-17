import {MigrationInterface, QueryRunner} from 'typeorm';

export class CreateUsersTable1610803148216 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            create table users
            (
                id         int unsigned auto_increment,
                email      varchar(50)  not null,
                password   varchar(191) not null,
                sw_hero_id int unsigned not null,
                constraint users_pk
                    primary key (id)
            );
        `)
        await queryRunner.query(`
            create unique index users_email_uindex
                on users (email);
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            drop table users;
        `)
    }
}
