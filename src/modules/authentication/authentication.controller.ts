import {Body, Controller, HttpCode, Post, Put, Req, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {AuthenticationService} from './authentication.service';
import {RefreshTokenDto} from './transfer-objects/refresh-token.dto';
import {LoginDto} from './transfer-objects/login.dto';
import {ApiBearerAuth, ApiOperation, ApiUnauthorizedResponse} from '@nestjs/swagger';

@Controller()
export class AuthenticationController {
    constructor(
        private readonly authenticationService: AuthenticationService,
    ) {
    }

    @Post('/login')
    @UseGuards(AuthGuard('local'))
    @HttpCode(200)
    @ApiOperation({summary: 'Logs user in'})
    @ApiUnauthorizedResponse({description: 'Email or password are not valid'})
    async login(@Body() dto: LoginDto, @Req() request) {
        return request.user;
    }

    @Put('/refresh-token')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({summary: 'Returns new authentication data based on received refresh token'})
    @ApiUnauthorizedResponse({description: 'User is unauthenticated or given refresh token does not exist or is expired'})
    async refreshToken(@Body() dto: RefreshTokenDto, @Req() request) {
        return await this.authenticationService.refreshAccessToken(request.user, dto.token);
    }
}
