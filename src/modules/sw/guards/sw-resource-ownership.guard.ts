import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {InjectRepository} from '@nestjs/typeorm';
import {buildResourcePath, SwResourceType, UserResource} from '../../user/models/user-resource.model';
import {Repository} from 'typeorm';

@Injectable()
export class SwResourceOwnershipGuard implements CanActivate {
    constructor(
        @InjectRepository(UserResource) private readonly userResourceRepository: Repository<UserResource>,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const resourceType = this.reflector.get<string>('resourceType', context.getHandler());
        const request = context.switchToHttp().getRequest();
        const userId = request.user.userId;
        const resourceId = request.params.resourceId;
        const url = buildResourcePath(resourceType as SwResourceType, resourceId);
        const userResource = await this.userResourceRepository.findOne({userId, url});
        return !!userResource;
    }
}
