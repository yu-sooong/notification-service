import { AppDataSource } from '../cli/typeorm-datasource';
import { NotificationEntity } from '../entities/notification.entity';
import { faker } from '@faker-js/faker';

async function seedDatabase() {
  await AppDataSource.initialize();
  const notificationRepo = AppDataSource.getRepository(NotificationEntity);

  console.log('🚀 Seeding notifications...');

  const notifications = Array.from({ length: 50 }).map(() => ({
    user_id: faker.number.int({ min: 1, max: 10 }),
    channel: faker.helpers.arrayElement(['email', 'sms', 'line']),
    message: faker.lorem.sentence(),
    status: faker.helpers.arrayElement([0, 1, 2]),
    created_at: new Date(),
    updated_at: new Date(),
  }));

  await notificationRepo.insert(notifications);

  console.log('✅ Seeding completed! Inserted 50 records.');
  process.exit(0);
}

seedDatabase().catch((error) => {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
});
