import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password, minimum 6 characters',
    example: 'password123',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
