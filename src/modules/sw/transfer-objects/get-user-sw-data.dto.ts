import {TransferObject} from '../../../abstracts/transfer-object';
import {SwResourceType} from '../../user/models/user-resource.model';

export class GetUserSwDataDto extends TransferObject {
    userId: number;
    dataType: SwResourceType;
}
