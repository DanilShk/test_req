import {
  Global,
  Inject,
  InternalServerErrorException,
  Logger,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ClientProxy,
  ClientsModule,
  RmqStatus,
  Transport,
} from '@nestjs/microservices';
import { REQUEST_SERVISE } from 'src/common/constants/token.const';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: REQUEST_SERVISE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
            queue: configService.getOrThrow<string>('REQUEST_QUEUE'),
            queueOptions: {
              durable: true,
            },
            persistent: true,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RabbitMqModule implements OnModuleInit {
  private readonly logger = new Logger(RabbitMqModule.name, {
    timestamp: true,
  });
  constructor(
    @Inject(REQUEST_SERVISE) private client: ClientProxy,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    try {
      await this.client.connect();

      this.logger.log('RabbitMQ connection established');

      this.client.status.subscribe((status: RmqStatus) => {
        if (status === RmqStatus.DISCONNECTED) {
          throw new InternalServerErrorException(
            'Status of rabbitMq client is',
          );
        }

        this.logger.log(`Status of rabbitMq client is ${status}`);
      });
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ:', error.message);
      this.client.close();
    }
  }
}
