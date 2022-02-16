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
import {
  ApiOperation,
  ApiTags,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from "@nestjs/swagger";
import { CreateContentDto, CreateCommentDto } from "./contents.dto";
import { ContentsService } from "./contents.service";
import { JwtAuthGuard } from "../auth/auth.guard";

@Controller("contents")
@ApiTags("contents")
export class ContentsController {
  constructor(private readonly contentService: ContentsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post("create")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "게시물 작성", description: "게시물 작성 api" })
  @ApiCreatedResponse({
    description: "성공여부",
    schema: {
      example: {
        id: 8,
        userId: 11,
        tag: "공지사항",
        title: "테스트 제목",
        body: "테스트 내용",
        createdAt: "2022-02-12T06:57:01.728Z",
        user: {
          id: 11,
          email: "gallove0720@naver.com",
          name: "김대원",
          nickname: "경자맘",
          birth: "0000-00-00",
          phone: "000-0000-0000",
          address: "강원도 원주시 무실동",
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
          "제목을 입력하세요. || 내용을 입력하세요. || 태그를 선택해주세요.",
      },
    },
  })
  public async create(
    @Body() createContentDto: CreateContentDto,
    @ReqUser() { id: userId }: CurrentUser
  ) {
    return this.contentService.create(createContentDto, userId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  @ApiOperation({ summary: "게시물 조회", description: "게시물 조회 api" })
  @ApiCreatedResponse({
    description: "성공여부",
    schema: {
      example: {
        content: {
          id: 1,
          userId: 5,
          tag: "공지사항",
          title: "제목입니다",
          body: "내용입니다",
          createdAt: "2021-09-07T08:34:42.606Z",
          user: {
            id: 5,
            email: "test2@test.com",
            name: "테스트",
            nickname: "테스트중입니다",
            birth: "테스트용생년월일",
            phone: "테스트용번호",
            address: "테스트용주소",
            gender: 1,
            createdAt: "2021-08-31T16:14:50.438Z",
          },
        },
        comment: [
          {
            id: 1,
            userId: 10,
            contentId: 1,
            body: "ㅎㅎ",
            createdAt: "2021-09-17T07:51:14.512Z",
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
            id: 2,
            userId: 10,
            contentId: 1,
            body: "댓글을수정했습니다",
            createdAt: "2021-09-17T07:51:55.469Z",
            user: {
              id: 10,
              email: "test@gmail.com",
              name: "tt",
              nickname: "ttt",
              birth: "1996-12-12",
              phone: "010-2739-2271",
              address: "강원도 원주시 무실동",
              gender: 1,
              createdAt: "2021-09-15T07:44:51.563Z",
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
        message: "게시물이 없습니다.",
      },
    },
  })
  public async findOne(@Param("id", ParseIntPipe) id: number) {
    const content = await this.contentService.findOne({ id });
    const comment = await this.contentService.findAllContentComment({ id });
    return { content, comment };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @ApiOperation({
    summary: "전체게시물 조회",
    description: "전체게시물 조회 api",
  })
  @ApiCreatedResponse({
    description: "성공여부",
    schema: {
      example: [
        {
          id: 8,
          userId: 11,
          tag: "공지사항",
          title: "테스트 제목",
          body: "테스트 내용",
          createdAt: "2022-02-12T06:57:01.728Z",
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
          userId: 10,
          tag: "자유게시판",
          title: "마임",
          body: "안녕하세요 !",
          createdAt: "2021-09-17T14:52:07.429Z",
          user: {
            id: 10,
            email: "test@gmail.com",
            name: "tt",
            nickname: "ttt",
            birth: "1996-12-12",
            phone: "010-2739-2271",
            address: "강원도 원주시 무실동",
            gender: 1,
            createdAt: "2021-09-15T07:44:51.563Z",
          },
        },
      ],
    },
  })
  public async findAll() {
    const { items } = await this.contentService.findAll();
    return items;
  }

  @Put(":id/update")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "게시물 수정", description: "게시물 수정 api" })
  @ApiCreatedResponse({
    description: "성공여부",
    schema: { example: { message: "게시물 수정 완료!" } },
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
        message: "해당 게시물이 없습니다.",
      },
    },
  })
  public async update(
    @Param("id", ParseIntPipe) id: number,
    @ReqUser() { id: userId }: CurrentUser,
    @Body() content: any
  ) {
    await this.contentService.update(content, id, userId);
    return "게시물 수정 완료!";
  }

  @Delete(":id/delete")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "게시물 삭제", description: "게시물 삭제 api" })
  @ApiCreatedResponse({
    description: "성공여부",
    schema: { example: { message: "게시물 삭제 완료!" } },
  })
  @ApiNotFoundResponse({
    description: "오류코드",
    schema: {
      example: {
        message: "해당 게시물이 없습니다.",
      },
    },
  })
  public async delete(
    @Param("id", ParseIntPipe) id: number,
    @ReqUser() { id: userId }: CurrentUser
  ) {
    await this.contentService.delete(id, userId);
    return "게시물 삭제 완료!";
  }

  @Post(":id/commentCreate")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "댓글 작성", description: "댓글 작성 api" })
  @ApiCreatedResponse({
    description: "성공여부",
    schema: {
      example: {
        id: 12,
        userId: 11,
        contentId: 5,
        body: "댓글 테스트 내용",
        createdAt: "2022-02-14T13:28:29.443Z",
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
    @Body() createCommentDto: CreateCommentDto,
    @Param("id", ParseIntPipe) id: number,
    @ReqUser() { id: userId }: CurrentUser
  ) {
    return this.contentService.comment(createCommentDto, id, userId);
  }

  @Put(":id/:commentId/commentUpdate")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "댓글 수정", description: "댓글 수정 api" })
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
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "댓글 삭제", description: "댓글 삭제 api" })
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
    await this.contentService.commentDelete(commentId, id, userId);
    return "댓글 삭제 완료!";
  }
}
