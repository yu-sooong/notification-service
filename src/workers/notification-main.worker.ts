import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NotificationModuleWorker } from './notification-module.worker';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationModuleWorker,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost'],
        queue: 'notifications',
        queueOptions: { durable: true },
      },
    },
  );
  await app.listen();
  console.log('✅ Worker listening on RabbitMQ queue');
}
bootstrap();
