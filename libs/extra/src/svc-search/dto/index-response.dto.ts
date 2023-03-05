import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class IndexResponseDto {
  @ApiProperty()
  @IsString()
  index: string;
}
