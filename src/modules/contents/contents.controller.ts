import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  UseGuards,
  Body,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseIntPipe,
} from "@nestjs/common";
import { CurrentUser, ReqUser } from "../auth/auth.decorator";
import { CreateContentDto } from "./contents.dto";
import { ContentsService } from "./contents.service";
import { JwtAuthGuard } from "../auth/auth.guard";

@Controller("contents")
export class ContentsController {
  constructor(private readonly contentService: ContentsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post("create")
  @UseGuards(JwtAuthGuard)
  public async create(
    @Body() createContentDto: CreateContentDto,
    @ReqUser() { id: userId }: CurrentUser
  ) {
    return this.contentService.create(createContentDto, userId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  public async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.contentService.findOne({ id });
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  public async findAll() {
    const { items } = await this.contentService.findAll();
    return items;
  }

  @Put(":id/update")
  @UseGuards(JwtAuthGuard)
  public async update(
    @Param("id", ParseIntPipe) id: number,
    @ReqUser() { id: userId }: CurrentUser,
    @Body() content: any
  ) {
    await this.contentService.update(content, id, userId);
    return "게시글 수정 완료!";
  }

  @Delete(":id/delete")
  @UseGuards(JwtAuthGuard)
  public async delete(
    @Param("id", ParseIntPipe) id: number,
    @ReqUser() { id: userId }: CurrentUser
  ) {
    await this.contentService.delete(id, userId);
    return "게시글 삭제 완료!";
  }
}
