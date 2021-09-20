import { IsNotEmpty } from "class-validator";

export class CreateMagazineDto {
  @IsNotEmpty({ message: "사진을 넣어주세요" })
  photo: string;

  @IsNotEmpty({ message: "제목을 입력하세요" })
  title: string;

  @IsNotEmpty({ message: "내용을 입력하세요" })
  body: string;
}

export class CreateCommentDto {
  @IsNotEmpty({ message: "내용을 입력하세요" })
  body: string;
}
