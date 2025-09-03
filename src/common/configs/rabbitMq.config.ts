import { NestHybridApplicationOptions } from '@nestjs/common';
import { RmqOptions, Transport } from '@nestjs/microservices';

export const transporter: [RmqOptions, NestHybridApplicationOptions] = [
  {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL as string],
      queue: process.env.REQUEST_QUEUE,
      queueOptions: {
        durable: true,
      },
      persistent: true,
    },
  },
  { inheritAppConfig: true },
];
