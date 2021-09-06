import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor() {}

  public async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    if (!req.user) throw new UnauthorizedException("권한이 없습니다");
    return true;
  }
}
