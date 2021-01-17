import {Injectable} from '@nestjs/common';
import {Service} from '../../abstracts/service';
import {CreateUserDto} from './transfer-objects/create-user.dto';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from './models/user.model';
import {Repository} from 'typeorm';
import {AuthenticationService} from '../authentication/authentication.service';
import {randomInRange} from '../../helpers/helpers';

@Injectable()
export class UserService extends Service {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly authService: AuthenticationService,
    ) {
        super();
    }

    async createUser(dto: CreateUserDto) {
        // todo GET https://swapi.dev/api/people for `count` field to get max id
        // assume ids in sw-api are incremental
        const swHeroId = randomInRange(81) + 1;
        const user = await this.userRepository.save({
            email: dto.email,
            password: await this.authService.hash(dto.password),
            swHeroId,
        });
        return user;
        // todo authenticate user
    }
}
