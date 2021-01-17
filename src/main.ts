import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ConfigService} from './modules/config/config.service';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {ValidationPipe} from '@nestjs/common';
import {validationExceptionFactory} from './exceptions/validation.exception';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({
        exceptionFactory: validationExceptionFactory,
        validateCustomDecorators: true,
        transform: true,
        whitelist: true,
    }));
    const configService = new ConfigService('.env');
    if (configService.getString('APP_ENV') === 'development') {
        initializeSwaggerModule(app);
    }
    await app.listen(3000);
}

function initializeSwaggerModule(app) {
    const options = new DocumentBuilder()
        .setTitle('Star Wars')
        .setDescription('Star Wars API wrapper')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
}

bootstrap();
