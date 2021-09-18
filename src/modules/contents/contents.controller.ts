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
import { CreateContentDto, CreateCommentDto } from "./contents.dto";
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
    const content = await this.contentService.findOne({ id });
    const comment = await this.contentService.findAllContentComment({ id });
    return { content, comment };
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

  @UseInterceptors(ClassSerializerInterceptor)
  @Post(":id/commentCreate")
  @UseGuards(JwtAuthGuard)
  public async comment(
    @Body() createCommentDto: CreateCommentDto,
    @Param("id", ParseIntPipe) id: number,
    @ReqUser() { id: userId }: CurrentUser
  ) {
    return this.contentService.comment(createCommentDto, id, userId);
  }

  @Put(":id/:commentId/commentUpdate")
  @UseGuards(JwtAuthGuard)
  public async commentUpdate(
    @Body() comment: any,
    @Param("id", ParseIntPipe) id: number,
    @Param("commentId", ParseIntPipe) commentId: number,
    @ReqUser() { id: userId }: CurrentUser
  ) {
    await this.contentService.commentUpdate(comment, commentId, id, userId);
    return "댓글 수정 완료!";
  }

  @Delete(":id/:commentId/commentDelete")
  @UseGuards(JwtAuthGuard)
  public async commentDelete(
    @Param("id", ParseIntPipe) id: number,
    @Param("commentId", ParseIntPipe) commentId: number,
    @ReqUser() { id: userId }: CurrentUser
  ) {
    await this.contentService.commentDelete(commentId, id, userId);
    return "댓글 삭제 완료!";
  }
}
