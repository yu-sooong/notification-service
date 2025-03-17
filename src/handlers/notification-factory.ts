import { Injectable } from '@nestjs/common';
import { NotificationChannel } from '../enums/notification-channel.enum';
import { NotificationHandler } from './interface/notification.interface';
import { EmailNotificationHandler } from './email-handler';
import { SmsNotificationHandler } from './sms-handler';

@Injectable()
export class NotificationFactory {
  constructor(
    private readonly emailHandler: EmailNotificationHandler,
    private readonly smsHandler: SmsNotificationHandler,
  ) {}

  create(channel: NotificationChannel): NotificationHandler {
    switch (channel) {
      case NotificationChannel.EMAIL:
        return this.emailHandler;
      case NotificationChannel.SMS:
        return this.smsHandler;
      default:
        throw new Error(`Unsupported channel: ${channel}`);
    }
  }
}
