import { Test, TestingModule } from '@nestjs/testing';
import { NotificationConsumerWorker } from '../src/workers/notification-consumer.worker';
import { NotificationFactory } from '../src/handlers/notification-factory';
import { NotificationChannel } from '../src/enums/notification-channel.enum';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotificationEntity } from '../src/entities/notification.entity';

describe('NotificationConsumer', () => {
  let consumer: NotificationConsumerWorker;
  const mockFactory = {
    create: jest.fn(),
  };
  const mockRepo = {
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationConsumerWorker,
        { provide: NotificationFactory, useValue: mockFactory },
        { provide: getRepositoryToken(NotificationEntity), useValue: mockRepo },
      ],
    }).compile();

    consumer = module.get<NotificationConsumerWorker>(
      NotificationConsumerWorker,
    );
  });

  afterEach(() => jest.clearAllMocks());

  it('should process notification successfully', async () => {
    const mockHandler = { send: jest.fn().mockResolvedValue(true) };
    mockFactory.create.mockReturnValue(mockHandler);

    await consumer.handleNotification({
      id: 1,
      user_id: 1,
      channel: NotificationChannel.EMAIL,
      message: 'msg',
    });

    expect(mockFactory.create).toBeCalledWith(NotificationChannel.EMAIL);
    expect(mockHandler.send).toBeCalled();
    expect(mockRepo.update).toBeCalledWith(
      { id: 1 },
      { status: expect.anything() },
    );
  });

  it('should handle handler failure gracefully', async () => {
    const mockHandler = { send: jest.fn().mockResolvedValue(false) };
    mockFactory.create.mockReturnValue(mockHandler);

    await consumer.handleNotification({
      id: 2,
      user_id: 2,
      channel: NotificationChannel.SMS,
      message: 'msg',
    });

    expect(mockRepo.update).toBeCalledWith(
      { id: 2 },
      { status: expect.anything() },
    );
  });
  it('should handle DB update failure gracefully', async () => {
    const mockHandler = { send: jest.fn().mockResolvedValue(true) };
    mockFactory.create.mockReturnValue(mockHandler);
    mockRepo.update.mockRejectedValueOnce(new Error('DB fail'));

    await expect(
      consumer.handleNotification({
        id: 3,
        user_id: 3,
        channel: 'email' as NotificationChannel.EMAIL,
        message: 'msg',
      }),
    ).resolves.not.toThrow();

    expect(mockRepo.update).toBeCalled();
  });
});
