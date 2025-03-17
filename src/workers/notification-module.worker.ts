import { Module } from '@nestjs/common';
import { NotificationConsumerWorker } from './notification-consumer.worker';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from '../entities/notification.entity';
import { typeormConfig } from '../config/typeorm.config';
import { EmailNotificationHandler } from '../handlers/email-handler';
import { SmsNotificationHandler } from '../handlers/sms-handler';
import { NotificationFactory } from '../handlers/notification-factory';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      ...typeormConfig,
      autoLoadEntities: true, // 確保 Entity 能載入
    }),
    TypeOrmModule.forFeature([NotificationEntity]),
  ],
  controllers: [NotificationConsumerWorker],
  providers: [
    EmailNotificationHandler,
    SmsNotificationHandler,
    NotificationFactory,
  ],
})
export class NotificationModuleWorker {}
