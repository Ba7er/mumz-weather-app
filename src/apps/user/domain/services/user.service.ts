import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../data-access/entities/user.entity';
import { CreateUserDto } from '../../../auth/domain/dto/create.user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    const newUser = this.userRepository.create({
      email,
      password,
    });
    return this.userRepository.save(newUser);
  }

  async findOne(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }
}
