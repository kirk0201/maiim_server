import "./dotenv";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
  DocumentBuilder,
  SwaggerModule,
  SwaggerCustomOptions,
} from "@nestjs/swagger";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //웹 페이지를 새로고침을 해도 Token 값 유지
  const swaggerCustomOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  const config = new DocumentBuilder()
    .setTitle("Maiim API")
    .setDescription("마임 프로젝트 Swagger API 서버")
    .setVersion("1.0.0")
    .addCookieAuth("connect.sid")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        name: "JWT",
        in: "header",
      },
      "access-token"
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document, swaggerCustomOptions);

  // cors설정
  app.enableCors({
    origin: true,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  });
  app.use(cookieParser());
  // validation검증을 위한 로직
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 엔티티 데코레이터에 없는 프로퍼티 값은 무조건 거름
      forbidNonWhitelisted: true, // 엔티티 데코레이터에 없는 값 인입시 그 값에 대한 에러메세지 알려줌
      transform: true, // 컨트롤러가 값을 받을때 컨트롤러에 정의한 타입으로 형변환
      disableErrorMessages: false, // Error가 발생 했을 때 Error Message를 표시 여부 설정(true: 표시하지 않음, false: 표시함), 배포환경 에서는 true추천
    })
  );

  await app.listen(3000);
}
bootstrap();
