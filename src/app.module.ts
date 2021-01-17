import {CacheModule, Module} from '@nestjs/common';
import {UserModule} from './modules/user/user.module';
import {AuthenticationModule} from './modules/authentication/authentication.module';
import {ConfigModule} from './modules/config/config.module';
import DatabaseConfigService from './database/database-config.service';
import {TypeOrmModule} from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useClass: DatabaseConfigService,
        }),
        ConfigModule,
        AuthenticationModule,
        UserModule,
    ],
})
export class AppModule {
}
