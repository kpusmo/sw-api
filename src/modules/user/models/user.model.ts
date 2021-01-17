import {Column, Entity, OneToMany, PrimaryColumn} from 'typeorm';
import {UserResource} from './user-resource.model';

@Entity('users')
export class User {
    @PrimaryColumn()
    id: number;

    @Column()
    email: string;

    @Column({select: false})
    password: string;

    @Column()
    swHeroId: number;

    @OneToMany(type => UserResource, resource => resource.user)
    resources: UserResource[];
}
