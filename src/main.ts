import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { InternalServerErrorException, ValidationPipe } from '@nestjs/common';
import { validationConfig } from './common/configs/validation.config';
import { MicroserviceOptions, RmqStatus } from '@nestjs/microservices';
import { transporter } from './common/configs/rabbitMq.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: true,
  });

  app.useLogger(app.get(Logger));

  const server = app.connectMicroservice<MicroserviceOptions>(...transporter);

  server.status.subscribe((status: RmqStatus) => {
    if (status === RmqStatus.DISCONNECTED) {
      void server.close();
      throw new InternalServerErrorException('DISCONNECTED');
    }

    this.logger.log(`Status of rabbitMq server is ${status}`);
  });

  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe(validationConfig));

  const configService = app.get(ConfigService);
  const logger = app.get(Logger);

  const port = configService.get<string>('PORT') ?? 3000;

  await app.startAllMicroservices();
  await app.listen(Number(port), () =>
    logger.log(`app is working on the port ${port} `),
  );
}
void bootstrap();
