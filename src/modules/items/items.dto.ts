import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateItemDto {
  @IsNotEmpty({ message: "상품 이름을 입력하세요." })
  @ApiProperty({
    example: "마임스킨",
    description: "name",
    required: true,
  })
  name: string;

  @IsNotEmpty({ message: "상품 사진을 넣어주세요." })
  @ApiProperty({
    example: "마임스킨.jpg",
    description: "photo",
    required: true,
  })
  photo: string;

  @IsNotEmpty({ message: "카테고리를 선택해주세요." })
  @ApiProperty({
    example: "화장품",
    description: "category",
    required: true,
  })
  category: string;

  @IsNotEmpty({ message: "상품 설명을 입력하세요." })
  @ApiProperty({
    example: "피부 촉촉해지는 스킨",
    description: "itemDesc",
    required: true,
  })
  itemDesc: string;
}
