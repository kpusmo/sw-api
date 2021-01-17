import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {UserService} from './user.service';
import {CreateUserDto} from './transfer-objects/create-user.dto';
import {AuthGuard} from '@nestjs/passport';

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {
    }

    @Post()
    createUser(@Body() dto: CreateUserDto) {
        return this.userService.createUser(dto);
    }
}
