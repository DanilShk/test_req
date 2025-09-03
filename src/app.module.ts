import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'infrastructure/prisma/prisma.module';
import { LoggerModule } from 'nestjs-pino';
import { pinoConfig } from './common/configs/pino.config';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { RequestModule } from './request/request.module';
import { RabbitMqModule } from 'infrastructure/rabbitMq/rabbitMq.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    LoggerModule.forRoot(pinoConfig),
    PrismaModule,
    HealthcheckModule,
    RequestModule,
    RabbitMqModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
