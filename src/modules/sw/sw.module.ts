import {CacheModule, HttpModule, Module} from '@nestjs/common';
import {FilmController} from './controllers/film.controller';
import {SwService} from './sw.service';
import {UserEntityModule} from '../user/user-entity.module';
import {SpeciesController} from './controllers/species.controller';
import {VehicleController} from './controllers/vehicle.controller';
import {PlanetController} from './controllers/planet.controller';
import {StarshipController} from './controllers/starship.controller';

@Module({
    imports: [
        UserEntityModule,
        CacheModule.register(),
        HttpModule,
    ],
    controllers: [FilmController, SpeciesController, VehicleController, PlanetController, StarshipController],
    providers: [SwService],
    exports: [SwService],
})
export class SwModule {}
