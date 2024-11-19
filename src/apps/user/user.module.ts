import { Module } from '@nestjs/common';
import { UserService } from './domain/services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './data-access/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
