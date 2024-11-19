import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationDto {
  @ApiProperty({
    description: 'List of city names to add as locations for the user',
    example: ['Toronto', 'Cape Town'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  cities: string[];
}
