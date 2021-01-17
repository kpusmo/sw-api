import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './models/user.model';
import {UserResource} from './models/user-resource.model';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, UserResource]),
    ],
    exports: [
        TypeOrmModule,
    ]
})
export class UserEntityModule {}
