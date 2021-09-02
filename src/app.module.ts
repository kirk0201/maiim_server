import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { getConnectionOptions } from 'typeorm'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module'
import { OauthModule } from './modules/oauth/oauth.module'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          keepConnectionAlive: true,
        }),
    }),
    UsersModule,
    OauthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
