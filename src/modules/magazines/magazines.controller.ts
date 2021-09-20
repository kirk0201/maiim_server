import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Param,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  ParseIntPipe,
} from "@nestjs/common";
import { CurrentUser, ReqUser } from "../auth/auth.decorator";
import { CreateMagazineDto, CreateCommentDto } from "./magazines.dto";
import { MagazinesService } from "./magazines.service";
import { JwtAuthGuard } from "../auth/auth.guard";

@Controller("magazines")
export class MagazinesController {
  constructor(private readonly magazineService: MagazinesService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post("create")
  @UseGuards(JwtAuthGuard)
  public async create(
    @Body() createMagazineDto: CreateMagazineDto,
    @ReqUser() { id: userId }: CurrentUser
  ) {
    return this.magazineService.create(createMagazineDto, userId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  public async findOne(@Param("id", ParseIntPipe) id: number) {
    const magazine = await this.magazineService.findOne({ id });
    const comment = await this.magazineService.findAllMagazineComment({ id });
    return { magazine, comment };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  public async findAll() {
    const { items } = await this.magazineService.findAll();
    return items;
  }

  @Put(":id/update")
  @UseGuards(JwtAuthGuard)
  public async update(
    @Body() magazine: any,
    @Param("id", ParseIntPipe) id: number,
    @ReqUser() { id: userId }: CurrentUser
  ) {
    await this.magazineService.update(magazine, id, userId);
    return "매거진 수정 완료!";
  }

  @Delete(":id/delete")
  @UseGuards(JwtAuthGuard)
  public async delete(
    @Param("id", ParseIntPipe) id: number,
    @ReqUser() { id: userId }: CurrentUser
  ) {
    await this.magazineService.delete(id, userId);
    return "매거진 삭제 완료!";
  }

  @Post(":id/commentCreate")
  @UseGuards(JwtAuthGuard)
  public async comment(
    @Body() createCommentDto: CreateCommentDto,
    @Param("id", ParseIntPipe) id: number,
    @ReqUser() { id: userId }: CurrentUser
  ) {
    return this.magazineService.comment(createCommentDto, id, userId);
  }

  @Put(":id/:commentId/commentUpdate")
  @UseGuards(JwtAuthGuard)
  public async commentUpdate(
    @Body() comment: any,
    @Param("id", ParseIntPipe) id: number,
    @Param("commentId", ParseIntPipe) commentId: number,
    @ReqUser() { id: userId }: CurrentUser
  ) {
    await this.magazineService.commentUpdate(comment, commentId, id, userId);
    return "댓글 수정 완료!";
  }

  @Delete(":id/:commentId/commentDelete")
  @UseGuards(JwtAuthGuard)
  public async commentDelete(
    @Param("id", ParseIntPipe) id: number,
    @Param("commentId", ParseIntPipe) commentId: number,
    @ReqUser() { id: userId }: CurrentUser
  ) {
    await this.magazineService.commentDelete(commentId, id, userId);
    return "댓글 삭제 완료!";
  }
}
