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
import { CreateMagazineDto } from "./magazines.dto";
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
    return this.magazineService.findOne({ id });
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
}
