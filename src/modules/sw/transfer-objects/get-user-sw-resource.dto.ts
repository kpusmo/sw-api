import {TransferObject} from '../../../abstracts/transfer-object';
import {SwResourceType} from '../../user/models/user-resource.model';
import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsNumberString} from 'class-validator';

export class GetUserSwResourceDto extends TransferObject {
    dataType: SwResourceType;

    @IsNumberString()
    @IsNotEmpty()
    @ApiProperty()
    resourceId: number;
}
