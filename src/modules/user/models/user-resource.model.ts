import {Column, Entity, ManyToOne, PrimaryColumn} from 'typeorm';
import {User} from './user.model';

export enum SwResourceType {
    FILMS = 'films',
    SPECIES = 'species',
    VEHICLES = 'vehicles',
    STARSHIPS = 'starships',
    PLANETS = 'planets',
}

export const buildResourcePath = (type: SwResourceType, id: number) => `${type}/${id}/`;

@Entity('user_resources')
export class UserResource {
    @PrimaryColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    type: SwResourceType;

    @Column()
    url: string;

    @ManyToOne(type => User, user => user.resources)
    user: User;
}
