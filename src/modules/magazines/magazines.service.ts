import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Magazine } from "./magazine.entity";
import { MagazineComment } from "./magazine.comment.entity";
import {
  MagazineFindAllOptions,
  MagazineFindOneOptions,
  MagazineRepository,
  MagazineCommentFindAllOptions,
} from "./magazine.repository";
import { CreateMagazineDto, CreateCommentDto } from "./magazines.dto";

@Injectable()
export class MagazinesService {
  constructor(private readonly magazineRepository: MagazineRepository) {}

  public async create(createMagazineDto: CreateMagazineDto, userId: number) {
    const { photo, title, body } = createMagazineDto;

    if (title.length > 30)
      throw new ForbiddenException("제목은 30자를 넘을 수 없습니다.");

    const magazine = new Magazine({ photo, title, body, userId });
    await this.magazineRepository.save(magazine);
    return this.magazineRepository.findOne({ id: magazine.id });
  }

  public async findOne(options?: MagazineFindOneOptions) {
    const magazine = await this.magazineRepository.findOne(options);
    if (!magazine) throw new NotFoundException("매거진이 없습니다");
    return magazine;
  }

  public async findAll(options?: MagazineFindAllOptions) {
    return this.magazineRepository.findAll(options);
  }

  public async update(magazine: any, magazineId: number, userId: number) {
    const findMagazine = await this.magazineRepository.findOne({
      id: magazineId,
    });

    if (!findMagazine) throw new NotFoundException("해당 매거진이 없습니다");

    if (findMagazine.userId !== userId)
      throw new UnauthorizedException("권한이 없습니다");

    await this.magazineRepository.update(magazineId, magazine);
  }

  public async delete(magazineId: number, userId: number) {
    console.log(magazineId, userId);
    const findMagazine = await this.magazineRepository.findOne({
      id: magazineId,
    });

    if (!findMagazine) throw new NotFoundException("해당 매거진이 없습니다");

    if (findMagazine.userId !== userId)
      throw new UnauthorizedException("권한이 없습니다");

    await this.magazineRepository.delete(magazineId);
  }

  public async comment(
    createCommentDto: CreateCommentDto,
    magazineId: number,
    userId: number
  ) {
    const { body } = createCommentDto;

    const comment = new MagazineComment({ body, magazineId, userId });
    await this.magazineRepository.saveMagazineComment(comment);
    return this.magazineRepository.findOneMagazineComment({
      id: comment.id,
      magazineId: magazineId,
      userId: userId,
    });
  }

  public async findAllMagazineComment(options?: MagazineCommentFindAllOptions) {
    const comment = await this.magazineRepository.findAllMagazineComment(
      options
    );
    return comment;
  }

  public async commentUpdate(
    comment: any,
    commentId: number,
    magazineId: number,
    userId: number
  ) {
    const findComment = await this.magazineRepository.findOneMagazineComment({
      id: commentId,
      magazineId: magazineId,
    });

    if (!findComment) throw new NotFoundException("해당 게시물이 없습니다");

    if (findComment.userId !== userId)
      throw new UnauthorizedException("권한이 없습니다");

    await this.magazineRepository.updateMagazineComment(commentId, comment);
  }

  public async commentDelete(
    commentId: number,
    magazineId: number,
    userId: number
  ) {
    const findComment = await this.magazineRepository.findOneMagazineComment({
      id: commentId,
      magazineId: magazineId,
    });

    if (!findComment) throw new NotFoundException("해당 게시물이 없습니다");

    if (findComment.userId !== userId)
      throw new UnauthorizedException("권한이 없습니다");

    await this.magazineRepository.deleteMagazineComment(commentId);
  }
}
