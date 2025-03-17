import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from '../entities/notification.entity';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationStatus } from '../enums/notification-status.enum';
import { NotificationFactory } from '../handlers/notification-factory';
import { NotificationChannel } from '../enums/notification-channel.enum';

@Controller()
export class NotificationConsumerWorker {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepo: Repository<NotificationEntity>,
    private readonly notificationFactory: NotificationFactory,
  ) {}

  @EventPattern('notification_created')
  async handleNotification(
    @Payload()
    data: {
      channel: NotificationChannel;
      id: number;
      user_id: number;
      message: string;
    },
  ) {
    console.log('📥 Consumed Notification:', data);

    try {
      const handler = this.notificationFactory.create(data.channel);
      const result = await handler.send(data);

      await this.notificationRepo.update(
        { id: data.id },
        {
          status: result ? NotificationStatus.SENT : NotificationStatus.FAILED,
        },
      );
    } catch (err) {
      console.error('❌ Error processing notification:', err.message);

      await this.notificationRepo.update(
        { id: data.id },
        { status: NotificationStatus.FAILED },
      );
    }
  }
}
