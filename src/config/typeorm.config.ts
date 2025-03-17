import { DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig(); // CLI 也能吃 .env

export const typeormConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 33060,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'notification_service',
  entities:
    process.env.NODE_ENV === 'development'
      ? ['src/entities/*.ts']
      : ['dist/entities/*.entity.js'],
  migrations:
    process.env.NODE_ENV === 'development'
      ? ['src/migrations/*.ts']
      : ['dist/migrations/*.js'],
  synchronize: false,
  migrationsRun: true,
  logging: false,
};
