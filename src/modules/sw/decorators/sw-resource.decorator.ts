import {SetMetadata} from '@nestjs/common';

export const SwResource = (type: string) => SetMetadata('resourceType', type);
