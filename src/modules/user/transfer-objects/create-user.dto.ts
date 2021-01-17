import {IsEmail, IsNotEmpty, IsString, Matches} from 'class-validator';
import {TransferObject} from '../../../abstracts/transfer-object';
import {ApiProperty} from '@nestjs/swagger';
import {NotExists} from '../decorators/NotExists';

export class CreateUserDto extends TransferObject {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @NotExists('users', 'email', {message: 'Given email already exists'})
    @ApiProperty()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Matches(
        /(^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\!\@\#$%\^&\*\(\)\-\_\+\[\]\{\}\;\:\\'\"\,\<\.\>\/\?\`\~])(?=.{6,}))/,
        {message: 'Password must contain at least one uppercase character, one lowercase character, one number and one special sign'}
    )
    @ApiProperty()
    password: string;
}
