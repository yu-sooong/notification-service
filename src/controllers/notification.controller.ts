import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { GetNotificationDto } from '../dtos/get-notification.dto';
import { CreateNotificationDto } from '../dtos/create-notification.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({ summary: '建立通知' })
  @ApiBody({ type: CreateNotificationDto })
  @Post()
  async createNotification(@Body() body: CreateNotificationDto) {
    await this.notificationService.createNotification(
      body.user_id,
      body.channel,
      body.message,
    );
    return { status: 'Accepted', message: 'Notification enqueued.' };
  }

  @ApiOperation({ summary: '取得通知歷程' })
  @ApiQuery({ name: 'user_id', required: true })
  @Get()
  @UsePipes(new ValidationPipe({ transform: true })) // ✅ 啟用 DTO 驗證
  async getRecentNotifications(
    @Query() query: GetNotificationDto,
  ): Promise<object[]> {
    return await this.notificationService.getRecentNotifications(query.user_id);
  }
}
