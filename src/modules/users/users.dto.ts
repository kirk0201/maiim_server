import { IsEmail, IsNotEmpty } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";

export class JoinUserDto {
  @IsEmail({}, { message: "이메일 형식으로 입력해주세요." })
  @ApiProperty({
    example: "kkt34343@gmail.com",
    description: "email",
    required: true,
  })
  email: string;

  @IsNotEmpty({ message: "패스워드를 입력해주세요." })
  @ApiProperty({
    example: "mine7579",
    description: "password",
    required: true,
  })
  password: string;

  @IsNotEmpty({ message: "이름을 입력해주세요." })
  @ApiProperty({
    example: "김경태",
    description: "name",
    required: true,
  })
  name: string;

  @IsNotEmpty({ message: "닉네임을 입력해주세요." })
  @ApiProperty({
    example: "경자",
    description: "nickname",
    required: true,
  })
  nickname: string;

  @IsNotEmpty({ message: "생년월일을 입력해주세요." })
  @ApiProperty({
    example: "0000-00-00",
    description: "birth",
    required: true,
  })
  birth: string;

  @IsNotEmpty({ message: "주소를 입력해주세요." })
  @ApiProperty({
    example: "강원도 원주시 무실동",
    description: "address",
    required: true,
  })
  address: string;

  @IsNotEmpty({ message: "핸드폰 번호를 입력해주세요." })
  @ApiProperty({
    example: "000-0000-0000",
    description: "phone",
    required: true,
  })
  phone: string;

  @IsNotEmpty({ message: "성별을 입력해주세요." })
  @ApiProperty({
    example: "1",
    description: "gender",
    required: true,
  })
  gender: number;
}

export class LoginDto {
  @IsEmail({}, { message: "이메일 형식으로 입력해주세요." })
  @ApiProperty({
    example: "kkt34343@gmail.com",
    description: "email",
    required: true,
  })
  email: string;

  @IsNotEmpty({ message: "비밀번호를 입력해주세요." })
  @ApiProperty({
    example: "mine7579",
    description: "password",
    required: true,
  })
  password: string;
}

// updateUserDto joinUserDto와 인터페이스 동일하나 필수 값이 아니다
export class UpdateUserDto extends PartialType(JoinUserDto) {
  @ApiProperty({
    example: "비밀번호 변경",
    description: "password",
    required: false,
  })
  password?: string;

  @ApiProperty({
    example: "닉네임 변경",
    description: "nickname",
    required: false,
  })
  nickname?: string;

  @ApiProperty({
    example: "주소 변경",
    description: "address",
    required: false,
  })
  address?: string;

  @ApiProperty({
    example: "폰번호 변경",
    description: "phone",
    required: false,
  })
  phone?: string;
}

export class FindEmailDto {
  @IsNotEmpty({ message: "이름을 입력해주세요." })
  @ApiProperty({
    example: "경태킴",
    description: "name",
    required: true,
  })
  name: string;

  @IsNotEmpty({ message: "핸드폰 번호를 입력해주세요." })
  @ApiProperty({
    example: "010-2739-2271",
    description: "phone",
    required: true,
  })
  phone: string;
}

export class FindPwDto {
  @IsEmail({}, { message: "이메일 형식으로 입력해주세요." })
  @ApiProperty({
    example: "kkt12121@naver.com",
    description: "email",
    required: true,
  })
  email: string;

  @IsNotEmpty({ message: "이름을 입력해주세요." })
  @ApiProperty({
    example: "경태킴",
    description: "name",
    required: true,
  })
  name: string;
}
