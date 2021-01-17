import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

export enum RefreshTokenStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity('refresh_tokens')
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ownerId: number;

    @Column()
    token: string;

    @Column()
    status: RefreshTokenStatus;

    @Column()
    expirationDate: Date;

    @Column()
    lastRefreshDate: Date;

    @Column()
    numberOfRefreshes: number;

    @CreateDateColumn({type: 'datetime'})
    dateCreated: Date;

    @UpdateDateColumn({type: 'datetime'})
    dateModified: Date;
}
