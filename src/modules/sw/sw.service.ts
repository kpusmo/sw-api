import {Cache as CacheManager} from 'cache-manager';
import {BadGatewayException, CACHE_MANAGER, HttpService, Inject, Injectable} from '@nestjs/common';
import {Service} from '../../abstracts/service';
import {ConfigService} from '../config/config.service';
import {GetUserSwDataDto} from './transfer-objects/get-user-sw-data.dto';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {GetUserSwResourceDto} from './transfer-objects/get-user-sw-resource.dto';
import {buildResourcePath, UserResource} from '../user/models/user-resource.model';

@Injectable()
export class SwService extends Service {
    public static SW_API_URL_HTTPS = 'https://swapi.dev/api/';
    public static SW_API_URL_HTTP = 'http://swapi.dev/api/';

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: CacheManager,
        private configService: ConfigService,
        private httpService: HttpService,
        @InjectRepository(UserResource) private readonly userResourcesRepository: Repository<UserResource>,
    ) {
        super();
    }

    async getSingleResource(dto: GetUserSwResourceDto) {
        return this.fetchDataFromSwApi(buildResourcePath(dto.dataType, dto.resourceId));
    }

    async getUserResources(dto: GetUserSwDataDto) {
        const resources = await this.userResourcesRepository.find({
            where: {
                userId: dto.userId,
                type: dto.dataType,
            },
        });
        const dataPromises = resources.map(resource => this.fetchDataFromSwApi(resource.url))
        return Promise.all(dataPromises);
    }

    async fetchDataFromSwApi(resourcePath: string) {
        const cachedResponse = await this.cacheManager.get(resourcePath);
        if (cachedResponse) {
            return cachedResponse;
        }
        const response = await this.swRequest(resourcePath);
        if (response.status !== 200) {
            throw new BadGatewayException(response.data);
        }
        const data = response.data;
        console.log('fetched response', data);
        await this.cacheManager.set(resourcePath, data, {ttl: this.configService.getNumber('CACHE_TTL')});
        return data;
    }

    private swRequest(path: string) {
        return this.httpService
            .get(`${SwService.SW_API_URL_HTTPS}${path}`)
            .toPromise();
    }
}
