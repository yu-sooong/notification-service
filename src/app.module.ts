import { Module } from '@nestjs/common';
import { DatabaseModule } from './modules/database.module';
import { RedisMoudle } from './modules/redis.moudle';
import { NotificationModule } from './modules/notification.module';

@Module({
  imports: [DatabaseModule, RedisMoudle, NotificationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
