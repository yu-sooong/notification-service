import { IsNotEmpty, IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ description: 'User ID' })
  @IsInt()
  @IsNotEmpty({ message: 'user_id is required' })
  user_id: number;

  @ApiProperty({ description: '通知頻道 (email/sms)' })
  @IsString()
  @IsNotEmpty({ message: 'channel is required' })
  channel: string;

  @ApiProperty({ description: '通知訊息內容' })
  @IsString()
  @IsNotEmpty({ message: 'message is required' })
  message: string;
}
