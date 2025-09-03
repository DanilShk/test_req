import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { validationConfig } from './common/configs/validation.config';
import { MicroserviceOptions } from '@nestjs/microservices';
import { transporter } from './common/configs/rabbitMq.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: true,
  });

  app.connectMicroservice<MicroserviceOptions>(...transporter);

  app.use(helmet());

  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe(validationConfig));

  const configService = app.get(ConfigService);
  const logger = app.get(Logger);

  const port = configService.get<string>('PORT') ?? 3000;

  await app.startAllMicroservices();
  await app.listen(Number(port), () =>
    logger.log(`app is working on the port ${port} `),
  );
}
bootstrap();
