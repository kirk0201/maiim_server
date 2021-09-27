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
import { ItemsService } from "./items.service";
import { CurrentUser, ReqUser } from "../auth/auth.decorator";
import { JwtAuthGuard } from "../auth/auth.guard";

@Controller("items")
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post("create")
  @UseGuards(JwtAuthGuard)
  public async create(
    @Body() createItemDto: CreateItemDto,
    @ReqUser() { id: userId }: CurrentUser
  ) {
    return this.itemsService.create(createItemDto, userId);
  }

  @Get()
  public async findAll(@Query() query: any) {
    const { items } = await this.itemsService.findAll({
      category: query.category,
    });
    return items;
  }

  @Get(":id")
  public async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.itemsService.findOne({ id });
  }

  @Put(":id/update")
  @UseGuards(JwtAuthGuard)
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
  public async delete(
    @Param("id", ParseIntPipe) id: number,
    @ReqUser() { id: userId }: CurrentUser
  ) {
    await this.itemsService.delete(id, userId);
    return "상품 삭제 완료!";
  }
}
