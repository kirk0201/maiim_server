import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('google')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.oauthService.googleLogin(req)
  }
}