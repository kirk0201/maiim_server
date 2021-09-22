import { IsNotEmpty } from "class-validator";

export class CreateItemDto {
  @IsNotEmpty({ message: "상품 이름을 입력하세요" })
  name: string;

  @IsNotEmpty({ message: "상품 사진을 넣어주세요" })
  photo: string;

  @IsNotEmpty({ message: "카테고리를 선택해주세요" })
  category: string;

  @IsNotEmpty({ message: "상품 설명을 입력하세요" })
  itemDesc: string;
}
