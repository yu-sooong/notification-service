import { Inject, Injectable } from '@nestjs/common';
import { CacheProxy } from '../proxy/cache.proxy';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from '../entities/notification.entity';
import { ClientProxy } from '@nestjs/microservices';
import { NotificationStatus } from '../enums/notification-status.enum';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepo: Repository<NotificationEntity>,
    @Inject('RABBITMQ_SERVICE')
    private readonly rabbitClient: ClientProxy,
    private readonly cacheProxy: CacheProxy,
  ) {}

  async createNotification(user_id: number, channel: string, message: string) {
    const notification = this.notificationRepo.create({
      user_id,
      channel,
      message,
      status: NotificationStatus.PENDING,
    });
    await this.notificationRepo.save(notification);

    // purge 快取
    await this.cacheProxy.purgeNotificationCache(user_id);

    // 發佈到 MQ
    this.rabbitClient.emit('notification_created', {
      id: notification.id,
      user_id,
      channel,
      message,
    });
  }

  async getRecentNotifications(user_id: number): Promise<object[]> {
    return this.cacheProxy.getRecentNotifications(user_id);
  }
}
