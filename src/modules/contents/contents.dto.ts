import { IsNotEmpty } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";

export class CreateContentDto {
  @IsNotEmpty({ message: "제목을 입력하세요." })
  @ApiProperty({
    example: "테스트 제목",
    description: "title",
    required: true,
  })
  title: string;

  @IsNotEmpty({ message: "내용을 입력하세요." })
  @ApiProperty({
    example: "테스트 내용",
    description: "body",
    required: true,
  })
  body: string;

  @IsNotEmpty({ message: "태그를 선택해주세요." })
  @ApiProperty({
    example: "공지사항",
    description: "tag",
    required: true,
  })
  tag: string;
}

export class CreateCommentDto {
  @IsNotEmpty({ message: "내용을 입력하세요." })
  @ApiProperty({
    example: "테스트 댓글 내용",
    description: "body",
    required: true,
  })
  body: string;
}

export class UpdateContentDto extends PartialType(CreateContentDto) {
  @ApiProperty({
    example: "제목 수정",
    description: "title",
    required: false,
  })
  title?: string;

  @ApiProperty({
    example: "내용 수정",
    description: "body",
    required: false,
  })
  body?: string;

  @ApiProperty({
    example: "태그 수정",
    description: "tag",
    required: false,
  })
  tag?: string;
}
export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @ApiProperty({
    example: "댓글 내용 수정",
    description: "body",
    required: false,
  })
  body?: string;
}
