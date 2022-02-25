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
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
} from "@nestjs/swagger";
import {
  JoinUserDto,
  LoginDto,
  UpdateUserDto,
  FindEmailDto,
  FindPwDto,
} from "./users.dto";
import { UsersService } from "./users.service";
import { Response } from "express";
import { CurrentUser, ReqUser } from "../auth/auth.decorator";
import { JwtAuthGuard } from "../auth/auth.guard";

@Controller("users")
@ApiTags("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("join")
  @ApiOperation({ summary: "회원가입", description: "회원가입 api" })
  @ApiCreatedResponse({
    description: "성공여부",
    schema: { example: { message: "회원가입 성공!" } },
  })
  @ApiForbiddenResponse({
    description: "오류코드",
    schema: {
      example: {
        message:
          "이메일이 이미 존재합니다. || 닉네임이 10자 초과합니다. || 닉네임이 이미 존재합니다. || 비밀번호에 영문과 숫자를 포함시켜 주세요.",
      },
    },
  })
  @ApiBadRequestResponse({
    description: "오류코드",
    schema: {
      example: {
        message:
          "이메일 형식으로 입력해주세요. || 패스워드를 입력해주세요. || 이름을 입력해주세요. || 닉네임을 입력해주세요. || 생년월일을 입력해주세요. || 주소를 입력해주세요. || 핸드폰 번호를 입력해주세요. || 성별을 입력해주세요.",
      },
    },
  })
  public async joinUser(@Body() userData: JoinUserDto) {
    await this.usersService.joinUser(userData);
    return "회원가입 성공!";
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post("login")
  @ApiOperation({ summary: "로그인", description: "로그인 api" })
  @ApiCreatedResponse({
    description: "성공여부",
    schema: {
      example: {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImlhdCI6MTY0NDU2MjE4OCwiZXhwIjoxNjQ0NjQ4NTg4fQ.dqtFIu8KVi9ZyTQgMLhBgt2y3X5KdPQOPaDtNESU8x8",
        findUser: {
          id: 1,
          email: "kkt34343@gmail.com",
          name: "김경태",
          nickname: "경자",
          birth: "0000-00-00",
          phone: "000-0000-0000",
          address: "강원도 원주시 무실동",
          gender: 1,
          createdAt: "2021-09-24T07:15:56.373Z",
        },
      },
    },
  })
  @ApiForbiddenResponse({
    description: "오류코드",
    schema: {
      example: {
        message: "존재하지 않는 이메일입니다. || 비밀번호가 일치하지 않습니다.",
      },
    },
  })
  @ApiBadRequestResponse({
    description: "오류코드",
    schema: {
      example: {
        message: "이메일 형식으로 입력해주세요. || 비밀번호를 입력해주세요.",
      },
    },
  })
  public async login(
    @Body() login: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { token, findUser } = await this.usersService.login(login);
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
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "로그아웃", description: "로그아웃 api" })
  @ApiCreatedResponse({
    description: "성공여부",
    schema: { example: { message: "로그아웃 성공!" } },
  })
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
  @ApiOperation({ summary: "전체유저 조회", description: "전체유저 조회 api" })
  @ApiCreatedResponse({
    description: "성공여부",
    schema: {
      example: [
        {
          id: 1,
          email: "kkt34343@gmail.com",
          name: "김경태",
          nickname: "경자",
          birth: "0000-00-00",
          phone: "000-0000-0000",
          address: "강원도 원주시 무실동",
          gender: 1,
          createdAt: "2021-09-24T07:15:56.373Z",
        },
        {
          id: 11,
          email: "gallove0720@naver.com",
          name: "김대원",
          nickname: "경자mom",
          birth: "0000-00-00",
          phone: "000-0000-0000",
          address: "강원도 원주시 무실동",
          gender: 2,
          createdAt: "2021-09-24T07:15:56.373Z",
        },
      ],
    },
  })
  public async findAll() {
    const { items } = await this.usersService.findAll();
    return items;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get("userInfo")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "유저 조회", description: "유저 조회 api" })
  @ApiCreatedResponse({
    description: "성공여부",
    schema: {
      example: {
        id: 1,
        email: "kkt34343@gmail.com",
        name: "김경태",
        nickname: "경자",
        birth: "0000-00-00",
        phone: "000-0000-0000",
        address: "강원도 원주시 무실동",
        gender: 1,
        createdAt: "2021-09-24T07:15:56.373Z",
      },
    },
  })
  public async findOne(@ReqUser() { id: userId }: CurrentUser) {
    return this.usersService.findOne({ id: userId });
  }

  @Put("update")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "유저정보 수정", description: "유저정보 수정 api" })
  @ApiCreatedResponse({
    description: "성공여부",
    schema: { example: { message: "유저정보 수정!" } },
  })
  @ApiForbiddenResponse({
    description: "오류코드",
    schema: {
      example: {
        message:
          "비밀번호에 영문과 숫자를 포함시켜 주세요. || 닉네임이 10자 초과합니다. || 닉네임이 이미 존재합니다.",
      },
    },
  })
  public async update(
    @Body() updateUser: UpdateUserDto,
    @ReqUser() { id: userId }: CurrentUser
  ) {
    await this.usersService.update(updateUser, userId);
    return "유저정보 수정!";
  }

  @Delete("delete")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "회원탈퇴", description: "회원탈퇴 api" })
  @ApiCreatedResponse({
    description: "성공여부",
    schema: { example: { message: "회원탈퇴 완료!" } },
  })
  public async delete(@ReqUser() { id: userId }: CurrentUser) {
    await this.usersService.delete(userId);
    return "회원탈퇴 완료!";
  }

  @Post("findEmail")
  @ApiOperation({
    summary: "유저 이메일 찾기",
    description: "유저 이메일 찾기 api",
  })
  @ApiCreatedResponse({
    description: "성공여부",
    schema: { example: { email: "kkt12121@naver.com" } },
  })
  @ApiBadRequestResponse({
    description: "오류코드",
    schema: {
      example: {
        message: "이름을 입력해주세요. || 핸드폰 번호를 입력해주세요.",
      },
    },
  })
  @ApiForbiddenResponse({
    description: "오류코드",
    schema: {
      example: {
        message: "일치하는 회원이 없습니다.",
      },
    },
  })
  public async findEmail(@Body() userData: FindEmailDto) {
    return this.usersService.findEmail(userData);
  }

  @Post("findPw")
  @ApiOperation({
    summary: "유저 비밀번호 찾기",
    description: "유저 비밀번호 찾기 api",
  })
  @ApiCreatedResponse({
    description: "성공여부",
    schema: { example: { success: true } },
  })
  @ApiBadRequestResponse({
    description: "오류코드",
    schema: {
      example: {
        message: "이름을 입력해주세요. || 이메일 형식으로 입력해주세요.",
      },
    },
  })
  @ApiForbiddenResponse({
    description: "오류코드",
    schema: {
      example: {
        message: "일치하는 회원이 없습니다.",
      },
    },
  })
  public async findPw(@Body() userData: FindPwDto) {
    return this.usersService.findPw(userData);
  }
}
