import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from '../entities/notification.entity';
import { NotificationService } from '../services/notification.service';
import { NotificationController } from '../controllers/notification.controller';
import { CacheProxy } from '../proxy/cache.proxy';
import { RabbitMQModule } from './rabbitmq.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationEntity]), // ✅ 註冊 `Entity`
    RabbitMQModule,
  ],
  providers: [NotificationService, CacheProxy],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
