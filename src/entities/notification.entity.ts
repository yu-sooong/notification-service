import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { NotificationStatus } from '../enums/notification-status.enum';

@Entity('notifications')
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index() // ✅ user_id 索引
  @Column({ type: 'int' })
  user_id: number;

  @Index() // ✅ channel 索引
  @Column({ type: 'varchar', length: 50 })
  channel: string;

  @Column({ type: 'text' })
  message: string;

  @Index() // ✅ status 索引
  @Column({ type: 'tinyint', default: NotificationStatus.PENDING })
  status: number; // 0 = Pending, 1 = Sent, 2 = Failed

  @Index()
  @CreateDateColumn({ type: 'datetime' }) // ✅ 移除 default，讓 TypeORM 自動插入
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' }) // ✅ 讓 TypeORM 自動處理更新
  updated_at: Date;
}
