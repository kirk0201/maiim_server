import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepository } from './user.repository'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { UsersJoinValidator } from './users.join.validator'
import { GoogleStrategy } from 'src/utils/google.stratege'

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  providers: [UsersService, UsersJoinValidator, GoogleStrategy],
  controllers: [UsersController],
  exports: [UsersService],
})

export class UsersModule {}