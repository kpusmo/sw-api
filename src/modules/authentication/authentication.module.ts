import {Module} from '@nestjs/common';
import {AuthenticationService} from './authentication.service';
import {UserEntityModule} from '../user/user-entity.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RefreshToken} from './models/refresh-token.model';
import {PassportModule} from '@nestjs/passport';
import {ConfigService} from '../config/config.service';
import {JwtModule} from '@nestjs/jwt';
import {AuthenticationController} from './authentication.controller';
import {JwtStrategy} from './strategies/jwt.strategy';
import {LocalStrategy} from './strategies/local.strategy';

@Module({
    imports: [
        UserEntityModule,
        TypeOrmModule.forFeature([RefreshToken]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.getString('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.getString('JWT_LIFESPAN'),
                },
            }),
        }),
        TypeOrmModule.forFeature([RefreshToken]),
        PassportModule,
    ],
    providers: [AuthenticationService, JwtStrategy, LocalStrategy],
    controllers: [AuthenticationController],
    exports: [AuthenticationService],
})
export class AuthenticationModule {
}
