import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {UserEntityModule} from './user-entity.module';
import {AuthenticationModule} from '../authentication/authentication.module';

@Module({
    imports: [UserEntityModule, AuthenticationModule],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {
}
