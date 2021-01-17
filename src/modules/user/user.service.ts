import {Injectable} from '@nestjs/common';
import {Service} from '../../abstracts/service';
import {CreateUserDto} from './transfer-objects/create-user.dto';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from './models/user.model';
import {Connection, Repository} from 'typeorm';
import {AuthenticationService, AuthResult} from '../authentication/authentication.service';
import {SwResourceType, UserResource} from './models/user-resource.model';
import {SwService} from '../sw/sw.service';

interface PeopleData {
    count: number;
}

interface HeroData {
    homeworld: string,
    films: string[],
    species: string[],
    vehicles: string[],
    starships: string[],
}

type Hero = Omit<HeroData, 'homeworld'> & {
    planets: string[];
}

export interface CreateUserResponse {
    user: Pick<User, 'email' | 'swHeroId'>,
    auth: AuthResult,
}

@Injectable()
export class UserService extends Service {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(UserResource) private readonly userResourceRepository: Repository<UserResource>,
        private connection: Connection,
        private readonly authService: AuthenticationService,
        private readonly swService: SwService,
    ) {
        super();
    }

    async createUser(dto: CreateUserDto): Promise<CreateUserResponse> {
        const swHeroId = await this.pickRandomHeroId();
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        let user;
        try {
            await queryRunner.manager.save(User, {
                email: dto.email,
                password: await this.authService.hash(dto.password),
                swHeroId,
            }, {});
            user = await queryRunner.manager.findOne(User, {email: dto.email});
            const userResources = await this.fetchHeroResources(user);
            await queryRunner.manager.save(userResources);
            await queryRunner.commitTransaction();
        } catch (error) {
            console.log(error);
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
        return {
            user,
            auth: await this.authService.login(user.email, dto.password),
        };
    }

    private async pickRandomHeroId(): Promise<number> {
        // assume ids in sw-api are incremental
        const peopleData = await this.swService.fetchDataFromSwApi('people') as PeopleData;
        const max = peopleData.count - 1;
        return Math.floor(Math.random() * max) + 1;
    }

    private async fetchHeroResources(user: User): Promise<UserResource[]> {
        const heroData = await this.swService.fetchDataFromSwApi(`people/${user.swHeroId}`) as HeroData;
        const hero: Hero = {
            ...heroData,
            planets: [heroData.homeworld],
        };
        const userResources = Object.values(SwResourceType)
            .flatMap(
                swResourceType => hero[swResourceType]
                    .map(
                        url => url
                            .replace(SwService.SW_API_URL_HTTP, '')
                            .replace(SwService.SW_API_URL_HTTPS, '')
                    )
                    .map(
                        url => this.userResourceRepository.create({
                            type: swResourceType as SwResourceType,
                            userId: user.id,
                            url,
                        })
                    )
            );
        return userResources;
    }
}
