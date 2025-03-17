import { Test, TestingModule } from '@nestjs/testing';
import { EmailNotificationHandler } from '../src/handlers/email-handler';
import axios from 'axios';

jest.mock('axios');

describe('EmailNotificationHandler', () => {
  let handler: EmailNotificationHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailNotificationHandler],
    }).compile();

    handler = module.get<EmailNotificationHandler>(EmailNotificationHandler);
  });

  afterEach(() => jest.clearAllMocks());

  it('should send email successfully', async () => {
    (axios.post as jest.Mock).mockResolvedValue({ status: 200 });

    const result = await handler.send({
      user_id: 1,
      email: 'test@example.com',
      message: 'Hello',
    });

    expect(axios.post).toBeCalled();
    expect(result).toBe(true);
  });

  it('should handle email send failure', async () => {
    (axios.post as jest.Mock).mockRejectedValue(new Error('Send failed'));

    const result = await handler.send({
      user_id: 1,
      email: 'fail@test.com',
      message: 'Hello',
    });

    expect(result).toBe(false);
  });
});
