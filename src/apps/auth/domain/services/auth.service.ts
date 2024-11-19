import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../../user/domain/services/user.service';
import { CreateUserDto } from '../dto/create.user.dto';
import { User } from '../../../user/data-access/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ERROR_MESSAGES } from '../../../../libs/constants/constants';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../types/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async registration(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;
    const isRegistered = await this.userService.findOne(email);
    if (isRegistered) {
      throw new BadRequestException({
        message: ERROR_MESSAGES.ALREADY_REGISTERED,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(
      password,
      this.configService.get<number>('hash.SALT_ROUNDS'),
    );

    // Create and save the user
    return this.userService.create({ email, password: hashedPassword });
  }

  async login(createUserDto: CreateUserDto): Promise<{ access_token: string }> {
    const { email, password } = createUserDto;

    const user = await this.userService.findOne(email);
    if (!user) {
      throw new UnauthorizedException({
        message: ERROR_MESSAGES.WRONG_CREDENTIALS,
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    // Compare the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException({
        message: ERROR_MESSAGES.WRONG_CREDENTIALS,
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    const payload: JwtPayload = { sub: user.id, email };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }
}
