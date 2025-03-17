import { Injectable } from '@nestjs/common';
import { NotificationHandler } from './interface/notification.interface';

@Injectable()
export class SmsNotificationHandler implements NotificationHandler {
  private _params: unknown;

  send(params: unknown): Promise<boolean> {
    this._params = params;
    throw new Error('Method not implemented.');
  }
}
