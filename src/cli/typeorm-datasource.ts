import { DataSource } from 'typeorm';
import { NotificationEntity } from '../entities/notification.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 33060,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'notification_service',
  entities: [NotificationEntity],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: false,
});
