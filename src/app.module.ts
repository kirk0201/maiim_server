import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { getConnectionOptions } from "typeorm";
import { AppController } from "./app.controller";
import { AuthTokenMiddleware } from "./modules/auth/auth.token.middleware";
import { AppService } from "./app.service";
import { UsersModule } from "./modules/users/users.module";
import { OauthModule } from "./modules/oauth/oauth.module";
import { ContentsModule } from "./modules/contents/contents.module";
import { MagazinesModule } from "./modules/magazines/magazines.module";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          keepConnectionAlive: true,
        }),
    }),
    UsersModule,
    OauthModule,
    ContentsModule,
    MagazinesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthTokenMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
