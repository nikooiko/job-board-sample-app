import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpsertJobResponseDto {
  @ApiProperty()
  @IsString()
  searchableSince: Date;
  @ApiProperty()
  @IsString()
  searchIndex: string;
}
