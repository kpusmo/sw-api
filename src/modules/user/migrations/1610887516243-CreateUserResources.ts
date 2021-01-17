import {MigrationInterface, QueryRunner} from 'typeorm';

export class CreateUserResources1610887516243 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            create table user_resources
            (
                id      int unsigned auto_increment,
                user_id int unsigned                                                  not null,
                type    enum ('films', 'species', 'vehicles', 'starships', 'planets') null,
                url     varchar(100)                                                  not null,
                constraint user_resources_pk
                    primary key (id),
                constraint user_resources_users_id_fk
                    foreign key (user_id) references users (id)
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            drop table user_resources;
        `);
    }
}
