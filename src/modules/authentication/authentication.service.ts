import * as argon2 from 'argon2';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {Service} from '../../abstracts/service';
import {InjectRepository} from '@nestjs/typeorm';
import {RefreshToken, RefreshTokenStatus} from './models/refresh-token.model';
import {Repository} from 'typeorm';
import {addMinutes, isBefore} from 'date-fns';
import {User} from '../user/models/user.model';
import {ConfigService} from '../config/config.service';
import {JwtService} from '@nestjs/jwt';

export interface AuthResult {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface AuthUser {
    userId: number,
}


@Injectable()
export class AuthenticationService extends Service {
    constructor(
        @InjectRepository(RefreshToken)
        private readonly refreshTokenRepository: Repository<RefreshToken>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {
        super();
    }

    async login(email, password): Promise<AuthResult> {
        const user = await this.getUserLoginData(email);
        if (!user || !await this.checkCredentials(password, user)) {
            return;
        }
        const refreshToken = await this.createRefreshToken(user.id);
        return {
            expiresIn: this.configService.getNumber('JWT_LIFESPAN') * 60,
            accessToken: this.getAccessToken({
                userId: user.id,
            }),
            refreshToken: refreshToken.token,
        }
    }

    private async createRefreshToken(userId: number): Promise<RefreshToken> {
        await this.refreshTokenRepository.update({ownerId: userId}, {status: RefreshTokenStatus.INACTIVE});
        const now = new Date();
        const token = await this.hash('' + userId + now.getTime());
        const refreshToken = new RefreshToken();
        refreshToken.ownerId = userId;
        refreshToken.token = token;
        refreshToken.expirationDate = addMinutes(now, this.configService.getNumber('JWT_REFRESH_TOKEN_LIFESPAN'));
        return this.refreshTokenRepository.save(refreshToken);
    }

    private getAccessToken(user: AuthUser): string {
        return this.jwtService.sign(user);
    }

    private getUserLoginData(email: string) {
        return this.userRepository.findOne({
            where: {
                email,
            },
            select: ['id', 'email', 'password'],
        });
    }

    async hash(subject: string): Promise<string> {
        return argon2.hash(subject);
    }

    async checkCredentials(password: string, user: Pick<User, 'password'>) {
        return argon2.verify(user.password, password);
    }

    async refreshAccessToken(user: {userId}, token: string) {
        const userRefreshToken = await this.getAndVerifyRefreshToken(user.userId, token);
        const now = new Date();
        userRefreshToken.expirationDate = addMinutes(now, this.configService.getNumber('JWT_REFRESH_TOKEN_LIFESPAN'));
        userRefreshToken.numberOfRefreshes = userRefreshToken.numberOfRefreshes + 1;
        userRefreshToken.lastRefreshDate = now;
        await this.refreshTokenRepository.save(userRefreshToken);
        return {
            expiresIn: this.configService.getNumber('JWT_LIFESPAN') * 60,
            accessToken: this.getAccessToken(user),
            refreshToken: userRefreshToken.token,
        };
    }

    private async getAndVerifyRefreshToken(userId: number, token: string): Promise<RefreshToken> {
        const refreshToken = await this.refreshTokenRepository.findOne({
            where: {
                ownerId: userId,
                status: RefreshTokenStatus.ACTIVE,
                token,
            },
        });
        if (!refreshToken) {
            throw new UnauthorizedException();
        }
        if (isBefore(refreshToken.expirationDate, Date.now())) {
            throw new UnauthorizedException();
        }
        return refreshToken;
    }
}
