import { Test, TestingModule } from '@nestjs/testing';
import { CacheProxy } from '../src/proxy/cache.proxy';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotificationEntity } from '../src/entities/notification.entity';

describe('CacheProxy', () => {
  let proxy: CacheProxy;
  const mockRedis = {
    get: jest.fn(),
    setex: jest.fn(),
  };
  const mockRepo = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheProxy,
        { provide: 'REDIS_CLIENT', useValue: mockRedis },
        { provide: getRepositoryToken(NotificationEntity), useValue: mockRepo }, // ✅ 加上
      ],
    }).compile();

    proxy = module.get<CacheProxy>(CacheProxy);
  });

  afterEach(() => jest.clearAllMocks());

  it('should return cached notifications when cache hit', async () => {
    const fakeCache = JSON.stringify([{ id: 1, message: 'test' }]);
    mockRedis.get.mockResolvedValue(fakeCache);

    const result = await proxy.getRecentNotifications(1);

    expect(mockRedis.get).toBeCalledWith('notifications:1');
    expect(result).toEqual(JSON.parse(fakeCache));
  });

  it('should fetch from DB and cache when cache miss', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0); // ⬅️ 固定讓 TTL 是 120
    mockRedis.get.mockResolvedValue(null);
    mockRepo.find.mockResolvedValue([{ id: 1, message: 'db data' }]);

    const result = await proxy.getRecentNotifications(1);

    expect(mockRepo.find).toBeCalled();
    expect(mockRedis.setex).toBeCalledWith(
      'notifications:1',
      120,
      JSON.stringify(result),
    );
    expect(result).toEqual([{ id: 1, message: 'db data' }]);
  });
  it('should handle redis get error', async () => {
    mockRedis.get.mockRejectedValueOnce(new Error('Redis error'));
    await expect(proxy.getRecentNotifications(1)).rejects.toThrow(
      'Redis error',
    );
  });
});
