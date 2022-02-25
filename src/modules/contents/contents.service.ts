import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Content } from "./content.entity";
import { ContentComment } from "./content.comment.entity";
import {
  ContentFindAllOptions,
  ContentFindOneOptions,
  ContentRepository,
  ContentCommentFindAllOptions,
} from "./content.repository";
import {
  CreateContentDto,
  CreateCommentDto,
  UpdateContentDto,
  UpdateCommentDto,
} from "./contents.dto";

@Injectable()
export class ContentsService {
  constructor(private readonly contentRepository: ContentRepository) {}

  public async create(contentData: CreateContentDto, userId: number) {
    const { tag, title, body } = contentData;

    if (title.length > 30)
      throw new ForbiddenException("제목은 30자를 넘을 수 없습니다.");

    const content = new Content({ tag, title, body, userId });
    await this.contentRepository.save(content);
    return this.contentRepository.findOne({ id: content.id });
  }

  public async findOne(options?: ContentFindOneOptions) {
    const content = await this.contentRepository.findOne(options);
    if (!content) throw new NotFoundException("게시물이 없습니다.");
    return content;
  }

  public async findAll(options?: ContentFindAllOptions) {
    return this.contentRepository.findAll(options);
  }

  public async update(
    updateContent: UpdateContentDto,
    contentId: number,
    userId: number
  ) {
    const findContent = await this.contentRepository.findOne({ id: contentId });

    if (!findContent) throw new NotFoundException("해당 게시물이 없습니다.");

    if (updateContent.title.length > 30)
      throw new ForbiddenException("제목은 30자를 넘을 수 없습니다.");

    if (findContent.userId !== userId)
      throw new UnauthorizedException("권한이 없습니다.");

    await this.contentRepository.update(contentId, updateContent);
  }

  public async delete(contentId: number, userId: number) {
    const findContent = await this.contentRepository.findOne({ id: contentId });

    if (!findContent) throw new NotFoundException("해당 게시물이 없습니다.");

    if (findContent.userId !== userId)
      throw new UnauthorizedException("권한이 없습니다.");

    await this.contentRepository.delete(contentId);
  }

  public async comment(
    commentData: CreateCommentDto,
    contentId: number,
    userId: number
  ) {
    const { body } = commentData;

    const comment = new ContentComment({ body, contentId, userId });
    await this.contentRepository.saveContentComment(comment);

    return this.contentRepository.findOneContentComment({
      id: comment.id,
      contentId: contentId,
      userId: userId,
    });
  }

  public async findAllContentComment(options?: ContentCommentFindAllOptions) {
    const comment = await this.contentRepository.findAllContentComment(options);
    return comment;
  }

  public async commentUpdate(
    updateComment: UpdateCommentDto,
    commentId: number,
    contentId: number,
    userId: number
  ) {
    const findComment = await this.contentRepository.findOneContentComment({
      id: commentId,
      contentId: contentId,
    });

    if (!findComment) throw new NotFoundException("해당 댓글이 없습니다.");

    if (findComment.userId !== userId)
      throw new UnauthorizedException("권한이 없습니다.");

    await this.contentRepository.updateContentComment(commentId, updateComment);
  }

  public async commentDelete(
    commentId: number,
    contentId: number,
    userId: number
  ) {
    const findComment = await this.contentRepository.findOneContentComment({
      id: commentId,
      contentId: contentId,
    });

    if (!findComment) throw new NotFoundException("해당 댓글이 없습니다.");

    if (findComment.userId !== userId)
      throw new UnauthorizedException("권한이 없습니다.");

    await this.contentRepository.deleteContentComment(commentId);
  }
}
