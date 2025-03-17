import { Test, TestingModule } from '@nestjs/testing';
import { NotificationFactory } from '../src/handlers/notification-factory';
import { EmailNotificationHandler } from '../src/handlers/email-handler';
import { SmsNotificationHandler } from '../src/handlers/sms-handler';
import { NotificationChannel } from '../src/enums/notification-channel.enum';

describe('NotificationFactory', () => {
  let factory: NotificationFactory;
  const mockEmailHandler = { send: jest.fn() };
  const mockSmsHandler = { send: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationFactory,
        { provide: EmailNotificationHandler, useValue: mockEmailHandler },
        { provide: SmsNotificationHandler, useValue: mockSmsHandler },
      ],
    }).compile();

    factory = module.get<NotificationFactory>(NotificationFactory);
  });

  it('should return email handler for EMAIL channel', () => {
    const handler = factory.create(NotificationChannel.EMAIL);
    expect(handler).toBe(mockEmailHandler);
  });

  it('should return sms handler for SMS channel', () => {
    const handler = factory.create(NotificationChannel.SMS);
    expect(handler).toBe(mockSmsHandler);
  });

  it('should throw error for unsupported channel', () => {
    expect(() => factory.create('unknown' as NotificationChannel)).toThrow(
      'Unsupported channel',
    );
  });
});
