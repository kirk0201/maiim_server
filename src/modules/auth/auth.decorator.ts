import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export interface CurrentUser {
  id: number;
}

export const ReqUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // 클라이언트에서 보낸 request의 정보를 가져옵니다.
    const req = ctx.switchToHttp().getRequest();

    return { id: req.user.id } as CurrentUser;
  }
);
