import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { CreateItemDto } from "./items.dto";
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from "@nestjs/swagger";
import { ItemsService } from "./items.service";
import { CurrentUser, ReqUser } from "../auth/auth.decorator";
import { JwtAuthGuard } from "../auth/auth.guard";

@Controller("items")
@ApiTags("items")
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post("create")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "상품 등록", description: "상품 등록 api" })
  @ApiCreatedResponse({
    description: "성공여부",
    schema: {
      example: {
        id: 10,
        name: "마임스킨",
        photo: "마임스킨.jpg",
        category: "화장품",
        itemDesc: "피부 촉촉해지는 스킨",
        createdAt: "2022-02-16T16:24:13.229Z",
      },
    },
  })
  @ApiBadRequestResponse({
    description: "오류코드",
    schema: {
      example: {
        message:
          "상품 이름을 입력하세요. || 상품 사진을 넣어주세요. || 카테고리를 선택해주세요. || 상품 설명을 입력하세요.",
      },
    },
  })
  public async create(
    @Body() createItemDto: CreateItemDto,
    @ReqUser() { id: userId }: CurrentUser
  ) {
    return this.itemsService.create(createItemDto, userId);
  }

  @Get()
  @ApiOperation({ summary: "모든 상품", description: "모든 상품 api" })
  @ApiCreatedResponse({
    description: "성공여부",
    schema: {
      example: [
        {
          id: 10,
          name: "마임스킨",
          photo: "마임스킨.jpg",
          category: "화장품",
          itemDesc: "피부 촉촉해지는 스킨",
          createdAt: "2022-02-16T16:24:13.229Z",
        },
        {
          id: 8,
          name: "바디워시",
          photo: "바디워시.jpg",
          category: "화장품",
          itemDesc: "뽀송뽀송바디워시",
          createdAt: "2021-09-27T14:37:11.014Z",
        },
        {
          id: 1,
          name: "알로에수분젤",
          photo: "수분젤.jpg",
          category: "화장품",
          itemDesc: "촉촉해지는 수분젤",
          createdAt: "2021-09-23T13:09:24.745Z",
        },
      ],
    },
  })
  public async findAll(@Query() query: any) {
    const { items } = await this.itemsService.findAll({
      category: query.category,
    });
    return items;
  }

  @Get(":id")
  @ApiOperation({ summary: "상품 조회", description: "상품 조회 api" })
  @ApiCreatedResponse({
    description: "성공여부",
    schema: {
      example: {
        id: 10,
        name: "마임스킨",
        photo: "마임스킨.jpg",
        category: "화장품",
        itemDesc: "피부 촉촉해지는 스킨",
        createdAt: "2022-02-16T16:24:13.229Z",
      },
    },
  })
  @ApiNotFoundResponse({
    description: "오류코드",
    schema: {
      example: {
        message: "상품이 없습니다.",
      },
    },
  })
  public async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.itemsService.findOne({ id });
  }

  @Put(":id/update")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "상품 수정", description: "상품 수정 api" })
  @ApiCreatedResponse({
    description: "성공여부",
    schema: {
      example: {
        message: "상품 수정 완료!",
      },
    },
  })
  @ApiNotFoundResponse({
    description: "오류코드",
    schema: {
      example: {
        message: "상품이 없습니다.",
      },
    },
  })
  public async update(
    @Param("id", ParseIntPipe) id: number,
    @ReqUser() { id: userId }: CurrentUser,
    @Body() item: any
  ) {
    await this.itemsService.update(item, id, userId);
    return "상품 수정 완료!";
  }

  @Delete(":id/delete")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "상품 삭제", description: "상품 삭제 api" })
  @ApiCreatedResponse({
    description: "성공여부",
    schema: {
      example: {
        message: "상품 삭제 완료!",
      },
    },
  })
  @ApiNotFoundResponse({
    description: "오류코드",
    schema: {
      example: {
        message: "상품이 없습니다.",
      },
    },
  })
  public async delete(
    @Param("id", ParseIntPipe) id: number,
    @ReqUser() { id: userId }: CurrentUser
  ) {
    await this.itemsService.delete(id, userId);
    return "상품 삭제 완료!";
  }
}
