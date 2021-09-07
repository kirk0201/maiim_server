import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  UseGuards,
  Res,
  ClassSerializerInterceptor,
  UseInterceptors,
} from "@nestjs/common";
import { joinUserDto, loginDto } from "./users.dto";
import { UsersService } from "./users.service";
import { Response } from "express";
import { CurrentUser, ReqUser } from "../auth/auth.decorator";
import { JwtAuthGuard } from "../auth/auth.guard";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("join")
  public async joinUser(@Body() joinUserDto: joinUserDto) {
    await this.usersService.joinUser(joinUserDto);
    return "회원가입 성공!";
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post("login")
  public async login(
    @Body() loginDto: loginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { token, findUser } = await this.usersService.login(loginDto);
    res.cookie("token", token, {
      domain: "localhost",
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 1000,
    });
    return { token, findUser };
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  public async logout(@Res({ passthrough: true }) res: Response) {
    res.cookie("token", "", {
      domain: "localhost",
      path: "/",
      httpOnly: true,
      maxAge: 0,
    });
    return "로그아웃 성공!";
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get("allUser")
  public async findAll() {
    const { items } = await this.usersService.findAll();
    return items;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get("userInfo")
  @UseGuards(JwtAuthGuard)
  public async findOne(@ReqUser() { id: userId }: CurrentUser) {
    return this.usersService.findOne({ id: userId });
  }

  @Put("update")
  @UseGuards(JwtAuthGuard)
  public async update(
    @Body() user: any,
    @ReqUser() { id: userId }: CurrentUser
  ) {
    await this.usersService.update(user, userId);
    return "유저정보 수정!";
  }

  @Delete("delete")
  @UseGuards(JwtAuthGuard)
  public async delete(@ReqUser() { id: userId }: CurrentUser) {
    await this.usersService.delete(userId);
    return "회원탈퇴 완료!";
  }
}
