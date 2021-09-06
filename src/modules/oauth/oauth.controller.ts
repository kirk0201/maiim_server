import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { OauthService } from "./oauth.service";
import { AuthGuard } from "@nestjs/passport";

@Controller("google")
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @Get()
  @UseGuards(AuthGuard("google"))
  async googleAuth(@Req() req) {}

  @Get("redirect")
  @UseGuards(AuthGuard("google"))
  googleAuthRedirect(@Req() req, @Res({ passthrough: true }) res) {
    const { accessToken } = req.user;
    res.cookie("token", accessToken, {
      domain: "localhost",
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 1000,
    });
    return this.oauthService.googleLogin(req, res);
  }
}
