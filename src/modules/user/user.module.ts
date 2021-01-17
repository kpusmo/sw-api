import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {UserEntityModule} from './user-entity.module';
import {AuthenticationModule} from '../authentication/authentication.module';
import {SwModule} from '../sw/sw.module';

@Module({
    imports: [UserEntityModule, AuthenticationModule, SwModule],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {
}
