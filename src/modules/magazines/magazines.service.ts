import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Magazine } from "./magazine.entity";
import { MagazineComment } from "./magazine.comment.entity";
import { UserRepository } from "../users/user.repository";
import {
  MagazineFindAllOptions,
  MagazineFindOneOptions,
  MagazineRepository,
  MagazineCommentFindAllOptions,
} from "./magazine.repository";
import {
  CreateMagazineDto,
  CreateCommentDto,
  UpdateMagazineDto,
  UpdateCommentDto,
} from "./magazines.dto";

@Injectable()
export class MagazinesService {
  constructor(
    private readonly magazineRepository: MagazineRepository,
    private readonly userRepository: UserRepository
  ) {}

  public async create(magazineData: CreateMagazineDto, userId: number) {
    const { photo, title, body } = magazineData;

    const findManager = await this.userRepository.findOne({ id: userId });

    if (findManager.name !== "김대원")
      throw new UnauthorizedException("권한이 없습니다.");

    if (title.length > 30)
      throw new ForbiddenException("제목은 30자를 넘을 수 없습니다.");

    const magazine = new Magazine({ photo, title, body, userId });
    await this.magazineRepository.save(magazine);
    return this.magazineRepository.findOne({ id: magazine.id });
  }

  public async findOne(options?: MagazineFindOneOptions) {
    const magazine = await this.magazineRepository.findOne(options);
    if (!magazine) throw new NotFoundException("매거진이 없습니다.");
    return magazine;
  }

  public async findAll(options?: MagazineFindAllOptions) {
    return this.magazineRepository.findAll(options);
  }

  public async update(
    updateMagazine: UpdateMagazineDto,
    magazineId: number,
    userId: number
  ) {
    const findMagazine = await this.magazineRepository.findOne({
      id: magazineId,
    });

    if (!findMagazine) throw new NotFoundException("해당 매거진이 없습니다.");

    const findManager = await this.userRepository.findOne({ id: userId });

    if (findManager.name !== "김대원")
      throw new UnauthorizedException("권한이 없습니다.");

    if (updateMagazine.title.length > 30)
      throw new ForbiddenException("제목은 30자를 넘을 수 없습니다.");

    await this.magazineRepository.update(magazineId, updateMagazine);
  }

  public async delete(magazineId: number, userId: number) {
    console.log(magazineId, userId);
    const findMagazine = await this.magazineRepository.findOne({
      id: magazineId,
    });

    if (!findMagazine) throw new NotFoundException("해당 매거진이 없습니다.");

    const findManager = await this.userRepository.findOne({ id: userId });

    if (findManager.name !== "김대원")
      throw new UnauthorizedException("권한이 없습니다.");

    await this.magazineRepository.delete(magazineId);
  }

  public async comment(
    commentData: CreateCommentDto,
    magazineId: number,
    userId: number
  ) {
    const { body } = commentData;

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
    updateComment: UpdateCommentDto,
    commentId: number,
    magazineId: number,
    userId: number
  ) {
    const findComment = await this.magazineRepository.findOneMagazineComment({
      id: commentId,
      magazineId: magazineId,
    });

    if (!findComment) throw new NotFoundException("해당 댓글이 없습니다.");

    if (findComment.userId !== userId)
      throw new UnauthorizedException("권한이 없습니다.");

    await this.magazineRepository.updateMagazineComment(
      commentId,
      updateComment
    );
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

    if (!findComment) throw new NotFoundException("해당 댓글이 없습니다.");

    if (findComment.userId !== userId)
      throw new UnauthorizedException("권한이 없습니다.");

    await this.magazineRepository.deleteMagazineComment(commentId);
  }
}
