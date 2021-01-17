import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity('users')
export class User {
    @PrimaryColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    swHeroId: number;
}
