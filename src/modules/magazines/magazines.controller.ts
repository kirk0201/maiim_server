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
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiParam,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from "@nestjs/swagger";
import {
  CreateMagazineDto,
  CreateCommentDto,
  UpdateMagazineDto,
  UpdateCommentDto,
} from "./magazines.dto";
import { MagazinesService } from "./magazines.service";
import { JwtAuthGuard } from "../auth/auth.guard";

@Controller("magazines")
@ApiTags("magazines")
export class MagazinesController {
  constructor(private readonly magazineService: MagazinesService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post("create")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "매거진 작성", description: "매거진 작성 api" })
  @ApiCreatedResponse({
    description: "성공여부",
    schema: {
      example: {
        id: 7,
        userId: 11,
        photo: "사진.jpg",
        title: "제목입니다",
        body: "내용입니다",
        createdAt: "2022-02-14T15:47:50.230Z",
        user: {
          id: 11,
          email: "gallove0720@naver.com",
          name: "김대원",
          nickname: "경자맘",
          birth: "1966-07-20",
          phone: "010-2775-2279",
          address: "강원도 원주시 무실동 휴먼시아6차 606동 1401호",
          gender: 2,
          createdAt: "2021-09-24T07:15:56.373Z",
        },
      },
    },
  })
  @ApiForbiddenResponse({
    description: "오류코드",
    schema: {
      example: {
        message: "제목은 30자를 넘을 수 없습니다.",
      },
    },
  })
  @ApiBadRequestResponse({
    description: "오류코드",
    schema: {
      example: {
        message:
          "사진을 넣어주세요. || 제목을 입력하세요. || 내용을 입력하세요.",
      },
    },
  })
  public async create(
    @Body() magazineData: CreateMagazineDto,
    @ReqUser() { id: userId }: CurrentUser
  ) {
    return this.magazineService.create(magazineData, userId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  @ApiOperation({ summary: "매거진 조회", description: "매거진 조회 api" })
  @ApiParam({
    name: "id",
    required: true,
    description: "magazineId",
  })
  @ApiCreatedResponse({
    description: "성공여부",
    schema: {
      example: {
        magazine: {
          id: 6,
          userId: 11,
          photo: "사진2.jpg",
          title: "제목입니다2",
          body: "내용입니다2",
          createdAt: "2022-02-14T15:36:34.165Z",
          user: {
            id: 11,
            email: "gallove0720@naver.com",
            name: "김대원",
            nickname: "경자맘",
            birth: "1966-07-20",
            phone: "010-2775-2279",
            address: "강원도 원주시 무실동 휴먼시아6차 606동 1401호",
            gender: 2,
            createdAt: "2021-09-24T07:15:56.373Z",
          },
        },
        comment: [
          {
            id: 5,
            userId: 12,
            magazineId: 6,
            body: "잘봤습니다!",
            createdAt: "2022-02-14T16:01:02.852Z",
            user: {
              id: 12,
              email: "kkt12121@naver.com",
              name: "경태킴",
              nickname: "원주베이식",
              birth: "1996-12-12",
              phone: "010-2739-2271",
              address: "강원도 원주시 무실동 휴먼시아6차 606동 1401호",
              gender: 1,
              createdAt: "2022-02-09T04:23:52.032Z",
            },
          },
          {
            id: 6,
            userId: 12,
            magazineId: 6,
            body: "감사합니다!",
            createdAt: "2022-02-14T16:01:12.421Z",
            user: {
              id: 12,
              email: "kkt12121@naver.com",
              name: "경태킴",
              nickname: "원주베이식",
              birth: "1996-12-12",
              phone: "010-2739-2271",
              address: "강원도 원주시 무실동 휴먼시아6차 606동 1401호",
              gender: 1,
              createdAt: "2022-02-09T04:23:52.032Z",
            },
          },
        ],
      },
    },
  })
  @ApiNotFoundResponse({
    description: "오류코드",
    schema: {
      example: {
        message: "매거진이 없습니다.",
      },
    },
  })
  public async findOne(@Param("id", ParseIntPipe) id: number) {
    const magazine = await this.magazineService.findOne({ id });
    const comment = await this.magazineService.findAllMagazineComment({ id });
    return { magazine, comment };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @ApiOperation({
    summary: "전체매거진 조회",
    description: "전체매거진 조회 api",
  })
  @ApiCreatedResponse({
    description: "성공여부",
    schema: {
      example: [
        {
          id: 7,
          userId: 11,
          photo: "사진.jpg",
          title: "제목입니다",
          body: "내용입니다",
          createdAt: "2022-02-14T15:47:50.230Z",
          user: {
            id: 11,
            email: "gallove0720@naver.com",
            name: "김대원",
            nickname: "경자맘",
            birth: "1966-07-20",
            phone: "010-2775-2279",
            address: "강원도 원주시 무실동 휴먼시아6차 606동 1401호",
            gender: 2,
            createdAt: "2021-09-24T07:15:56.373Z",
          },
        },
        {
          id: 6,
          userId: 11,
          photo: "사진2.jpg",
          title: "제목입니다2",
          body: "내용입니다2",
          createdAt: "2022-02-14T15:36:34.165Z",
          user: {
            id: 11,
            email: "gallove0720@naver.com",
            name: "김대원",
            nickname: "경자맘",
            birth: "1966-07-20",
            phone: "010-2775-2279",
            address: "강원도 원주시 무실동 휴먼시아6차 606동 1401호",
            gender: 2,
            createdAt: "2021-09-24T07:15:56.373Z",
          },
        },
      ],
    },
  })
  public async findAll() {
    const { items } = await this.magazineService.findAll();
    return items;
  }

  @Put(":id/update")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "매거진 수정", description: "매거진 수정 api" })
  @ApiParam({
    name: "id",
    required: true,
    description: "magazineId",
  })
  @ApiCreatedResponse({
    description: "성공여부",
    schema: { example: { message: "매거진 수정 완료!" } },
  })
  @ApiForbiddenResponse({
    description: "오류코드",
    schema: {
      example: {
        message: "제목은 30자를 넘을 수 없습니다.",
      },
    },
  })
  @ApiNotFoundResponse({
    description: "오류코드",
    schema: {
      example: {
        message: "해당 매거진이 없습니다.",
      },
    },
  })
  public async update(
    @Body() updateMagazine: UpdateMagazineDto,
    @Param("id", ParseIntPipe) id: number,
    @ReqUser() { id: userId }: CurrentUser
  ) {
    await this.magazineService.update(updateMagazine, id, userId);
    return "매거진 수정 완료!";
  }

  @Delete(":id/delete")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "매거진 삭제", description: "매거진 삭제 api" })
  @ApiParam({
    name: "id",
    required: true,
    description: "magazineId",
  })
  @ApiCreatedResponse({
    description: "성공여부",
    schema: { example: { message: "매거진 삭제 완료!" } },
  })
  @ApiNotFoundResponse({
    description: "오류코드",
    schema: {
      example: {
        message: "해당 매거진이 없습니다.",
      },
    },
  })
  public async delete(
    @Param("id", ParseIntPipe) id: number,
    @ReqUser() { id: userId }: CurrentUser
  ) {
    await this.magazineService.delete(id, userId);
    return "매거진 삭제 완료!";
  }

  @Post(":id/commentCreate")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "댓글 작성", description: "댓글 작성 api" })
  @ApiParam({
    name: "id",
    required: true,
    description: "magazineId",
  })
  @ApiCreatedResponse({
    description: "성공여부",
    schema: {
      example: {
        id: 5,
        userId: 12,
        magazineId: 5,
        body: "잘봤습니다!",
        createdAt: "2022-02-15 01:01:02.852111",
      },
    },
  })
  @ApiBadRequestResponse({
    description: "오류코드",
    schema: {
      example: {
        message: "내용을 입력하세요.",
      },
    },
  })
  public async comment(
    @Body() commentData: CreateCommentDto,
    @Param("id", ParseIntPipe) id: number,
    @ReqUser() { id: userId }: CurrentUser
  ) {
    return this.magazineService.comment(commentData, id, userId);
  }

  @Put(":id/:commentId/commentUpdate")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "댓글 수정", description: "댓글 수정 api" })
  @ApiParam({
    name: "id",
    required: true,
    description: "magazineId",
  })
  @ApiParam({
    name: "commentId",
    required: true,
    description: "commentId",
  })
  @ApiCreatedResponse({
    description: "성공여부",
    schema: { example: { message: "댓글 수정 완료!" } },
  })
  @ApiNotFoundResponse({
    description: "오류코드",
    schema: {
      example: {
        message: "해당 댓글이 없습니다.",
      },
    },
  })
  public async commentUpdate(
    @Body() updateComment: UpdateCommentDto,
    @Param("id", ParseIntPipe) id: number,
    @Param("commentId", ParseIntPipe) commentId: number,
    @ReqUser() { id: userId }: CurrentUser
  ) {
    await this.magazineService.commentUpdate(
      updateComment,
      commentId,
      id,
      userId
    );
    return "댓글 수정 완료!";
  }

  @Delete(":id/:commentId/commentDelete")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "댓글 삭제", description: "댓글 삭제 api" })
  @ApiParam({
    name: "id",
    required: true,
    description: "magazineId",
  })
  @ApiParam({
    name: "commentId",
    required: true,
    description: "commentId",
  })
  @ApiCreatedResponse({
    description: "성공여부",
    schema: { example: { message: "댓글 삭제 완료!" } },
  })
  @ApiNotFoundResponse({
    description: "오류코드",
    schema: {
      example: {
        message: "해당 댓글이 없습니다.",
      },
    },
  })
  public async commentDelete(
    @Param("id", ParseIntPipe) id: number,
    @Param("commentId", ParseIntPipe) commentId: number,
    @ReqUser() { id: userId }: CurrentUser
  ) {
    await this.magazineService.commentDelete(commentId, id, userId);
    return "댓글 삭제 완료!";
  }
}
