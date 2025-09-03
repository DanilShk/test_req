import { RmqOptions, Transport } from '@nestjs/microservices';

export const transporter: RmqOptions = {
  transport: Transport.RMQ,
  options: {
    urls: [process.env.RABBITMQ_URL as string],
    queue: process.env.REQUEST_QUEUE,
    queueOptions: {
      durable: true,
    },
    persistent: true,
  },
};
