import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMagazineDto {
  @IsNotEmpty({ message: "사진을 넣어주세요." })
  @ApiProperty({
    example: "사진.jpg",
    description: "photo",
    required: true,
  })
  photo: string;

  @IsNotEmpty({ message: "제목을 입력하세요." })
  @ApiProperty({
    example: "제목입니다",
    description: "title",
    required: true,
  })
  title: string;

  @IsNotEmpty({ message: "내용을 입력하세요." })
  @ApiProperty({
    example: "내용입니다",
    description: "body",
    required: true,
  })
  body: string;
}

export class CreateCommentDto {
  @IsNotEmpty({ message: "내용을 입력하세요." })
  @ApiProperty({
    example: "내용입니다",
    description: "body",
    required: true,
  })
  body: string;
}
