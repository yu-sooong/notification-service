import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from '../src/services/notification.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotificationEntity } from '../src/entities/notification.entity';
import { CacheProxy } from '../src/proxy/cache.proxy';
import { NotificationStatus } from '../src/enums/notification-status.enum';

describe('NotificationService', () => {
  let service: NotificationService;
  const mockRepo = {
    create: jest.fn().mockImplementation((dto) => dto), // ✅ 補上 create()
    save: jest.fn(),
  };
  const mockClientProxy = {
    emit: jest.fn(),
  };
  const mockCacheProxy = {
    getRecentNotifications: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        { provide: getRepositoryToken(NotificationEntity), useValue: mockRepo },
        { provide: 'RABBITMQ_SERVICE', useValue: mockClientProxy },
        { provide: CacheProxy, useValue: mockCacheProxy },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should emit message to queue', async () => {
    await service.createNotification(1, 'email', 'test message');

    expect(mockRepo.create).toBeCalledWith({
      user_id: 1,
      channel: 'email',
      message: 'test message',
      status: NotificationStatus.PENDING,
    });
    expect(mockRepo.save).toBeCalled();
    expect(mockClientProxy.emit).toBeCalledWith(
      'notification_created',
      expect.objectContaining({ user_id: 1, channel: 'email' }),
    );
  });
  it('should handle repository save error gracefully', async () => {
    mockRepo.save.mockRejectedValueOnce(new Error('DB error'));
    await expect(service.createNotification(1, 'email', 'msg')).rejects.toThrow(
      'DB error',
    );
  });
});
