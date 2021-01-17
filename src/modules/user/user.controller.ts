import {Body, Controller, Post} from '@nestjs/common';
import {UserService} from './user.service';
import {CreateUserDto} from './transfer-objects/create-user.dto';
import {ApiOperation} from '@nestjs/swagger';

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {
    }

    @Post()
    @ApiOperation({summary: 'Creates a new user'})
    createUser(@Body() dto: CreateUserDto) {
        return this.userService.createUser(dto);
    }
}
