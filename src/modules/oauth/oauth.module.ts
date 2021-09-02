import { Module } from '@nestjs/common';
import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';
import { GoogleStrategy } from 'src/utils/google.stratege'
import { UserRepository } from '../users/user.repository'
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  controllers: [OauthController],
  providers: [OauthService, GoogleStrategy],
})
    
export class OauthModule {}