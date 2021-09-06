import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { verifyToken } from "src/utils/utils.jwt";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthTokenMiddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService) {}

  public async use(req: Request, res: Response, next: NextFunction) {
    const userId = await this.parseUserId(req);

    const anyReq = req as any;

    const user = await this.userService.findOne({ id: userId });
    anyReq.user = user;
    return next();
  }

  private async parseUserId(req: Request): Promise<number> {
    let userId: number = null;
    try {
      const { authorization } = req.headers;

      const token = authorization.replace("Bearer ", "").replace("bearer ", "");
      const decoded = await verifyToken(token);
      userId = decoded.id;
    } catch (e) {} /* eslint no-empty: "off" */

    return userId;
  }
}
