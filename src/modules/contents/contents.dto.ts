import { IsNotEmpty } from "class-validator";

export class CreateContentDto {
  @IsNotEmpty({ message: "제목을 입력하세요" })
  title: string;

  @IsNotEmpty({ message: "내용을 입력하세요" })
  body: string;

  @IsNotEmpty({ message: "태그를 선택해주세요" })
  tag: string;
}

export class CreateCommentDto {
  @IsNotEmpty({ message: "내용을 입력하세요" })
  body: string;
}
