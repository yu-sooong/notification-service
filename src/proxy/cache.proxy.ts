import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from '../entities/notification.entity';

interface NotificationCache {
  id: number;
  user_id: number;
  channel: string;
  message: string;
  status: number;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class CacheProxy {
  private readonly CACHE_TTL = 120;

  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepo: Repository<NotificationEntity>,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  async getRecentNotifications(user_id: number): Promise<NotificationCache[]> {
    const cacheKey = `notifications:${user_id}`;

    const cachedData = await this.redisClient.get(cacheKey);
    if (cachedData) {
      console.log('🟢 Cache hit!');

      return JSON.parse(cachedData);
    }

    console.log('🔴 Cache miss! Fetching from DB...');
    const notifications = await this.notificationRepo.find({
      where: { user_id },
      order: { created_at: 'DESC' },
      take: 20,
    });

    await this.redisClient.setex(
      cacheKey,
      this.CACHE_TTL,
      JSON.stringify(notifications),
    );

    return notifications;
  }
}
