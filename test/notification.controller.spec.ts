import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from '../src/controllers/notification.controller';
import { NotificationService } from '../src/services/notification.service';
import { CreateNotificationDto } from '../src/dtos/create-notification.dto';

describe('NotificationController', () => {
  let controller: NotificationController;
  let service: NotificationService;

  const mockNotificationService: Partial<NotificationService> = {
    createNotification: jest.fn(),
    getRecentNotifications: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
    service = module.get<NotificationService>(NotificationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createNotification', () => {
    it('should call service.createNotification', async () => {
      const dto: CreateNotificationDto = {
        user_id: 1,
        channel: 'email',
        message: 'Hello!',
      };

      await controller.createNotification(dto);

      expect(service.createNotification).toBeCalledWith(
        dto.user_id,
        dto.channel,
        dto.message,
      );
    });
  });

  describe('getRecentNotifications', () => {
    it('should call service.getRecentNotifications', async () => {
      const mockNotifications = [{ id: 1, message: 'Test' }];

      (service.getRecentNotifications as jest.Mock).mockResolvedValue(
        mockNotifications,
      );

      const query = { user_id: 1 };
      const result = await controller.getRecentNotifications(query);

      expect(service.getRecentNotifications).toBeCalledWith(1);
      expect(result).toEqual(mockNotifications);
    });
  });
});
