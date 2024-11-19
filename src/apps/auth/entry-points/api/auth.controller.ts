import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../../domain/services/auth.service';
import { CreateUserDto } from '../../domain/dto/create.user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'Register a new user',
    description: 'Registers a new user by providing email and password',
  })
  @Post('registration')
  handleRegistrationRequest(@Body() createUserDto: CreateUserDto) {
    return this.authService.registration(createUserDto);
  }

  @ApiOperation({
    summary: 'Login an existing user',
    description: 'Logs in an existing user with email and password',
  })
  @Post('login')
  handleLoginRequest(@Body() createUserDto: CreateUserDto) {
    return this.authService.login(createUserDto);
  }
}
