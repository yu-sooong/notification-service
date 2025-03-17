import { IsNotEmpty, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetNotificationDto {
  @IsNotEmpty({ message: 'user_id is required' })
  @Transform(({ value }) => parseInt(value, 10)) // 確保 `user_id` 轉換為整數
  @IsInt({ message: 'user_id must be an integer' })
  user_id: number;
}
