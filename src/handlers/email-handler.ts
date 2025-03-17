import { Injectable } from '@nestjs/common';
import { NotificationHandler } from './interface/notification.interface';
import axios from 'axios';

@Injectable()
export class EmailNotificationHandler implements NotificationHandler {
  async send(params: {
    user_id: number;
    message: string;
    email: string;
  }): Promise<boolean> {
    const { user_id, message, email } = params;
    try {
      const response = await axios.post(
        'https://api.mailslurp.com/sendEmail',
        {
          inboxId: process.env.MAILSLURP_INBOX_ID,
          to: email || 'q0979058072@gmail.com', // 測試收件可填自己
          subject: `Notification for User ${user_id}`,
          body: message,
        },
        {
          headers: {
            'x-api-key': process.env.MAILSLURP_API_KEY,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('📨 MailSlurp Email Sent! ID:', response.status);
      return true;
    } catch (err) {
      console.error('❌ MailSlurp Email failed:', err.message);
      return false;
    }
  }
}
