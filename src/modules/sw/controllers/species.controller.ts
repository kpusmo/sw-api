import {Controller, Get, Param, Req, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {GetUserSwDataDto} from '../transfer-objects/get-user-sw-data.dto';
import {SwResourceType} from '../../user/models/user-resource.model';
import {SwService} from '../sw.service';
import {GetUserSwResourceDto} from '../transfer-objects/get-user-sw-resource.dto';
import {SwResourceOwnershipGuard} from '../guards/sw-resource-ownership.guard';
import {SwResource} from '../decorators/sw-resource.decorator';
import {ApiBearerAuth, ApiForbiddenResponse, ApiOperation} from '@nestjs/swagger';

@Controller('species')
export class SpeciesController {
    constructor(
        private swService: SwService,
    ) {
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({summary: "Fetches authenticated user's species list."})
    getList(@Req() request) {
        const dto = new GetUserSwDataDto();
        dto.userId = request.user.userId;
        dto.dataType = SwResourceType.SPECIES;
        return this.swService.getUserResources(dto);
    }

    @Get(':resourceId')
    @UseGuards(AuthGuard('jwt'), SwResourceOwnershipGuard)
    @SwResource(SwResourceType.SPECIES)
    @ApiBearerAuth()
    @ApiOperation({summary: 'Fetches species of given resourceId'})
    @ApiForbiddenResponse({description: 'Species does not belong to the hero of authenticated user'})
    get(@Param() dto: GetUserSwResourceDto) {
        dto.dataType = SwResourceType.SPECIES;
        return this.swService.getSingleResource(dto);
    }
}
