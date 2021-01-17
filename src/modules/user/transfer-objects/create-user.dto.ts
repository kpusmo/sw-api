import {IsEmail, IsNotEmpty, IsString, Matches} from 'class-validator';
import {TransferObject} from '../../../abstracts/transfer-object';

export class CreateUserDto extends TransferObject {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/(^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\!\@\#$%\^&\*\(\)\-\_\+\[\]\{\}\;\:\\'\"\,\<\.\>\/\?\`\~])(?=.{6,}))/)
    password: string;
}
