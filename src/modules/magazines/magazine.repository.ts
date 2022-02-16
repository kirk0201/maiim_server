import { DeepPartial, EntityRepository, FindConditions } from "typeorm";
import { removeNilFromObject } from "src/utils/utils";
import { IPagination } from "../crud/pagination";
import {
  AbstractEntityFindAllOptions,
  AbstractEntityFindOneOptions,
  AbstractEntityRepository,
  EntityFindOperator,
} from "../crud/entity.repository";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { MagazineComment } from "./magazine.comment.entity";
import { Magazine } from "./magazine.entity";

export interface MagazineFindOneOptions extends AbstractEntityFindOneOptions {}

export interface MagazineFindAllWhereOptions {}

export interface MagazineFindAllOptions extends AbstractEntityFindAllOptions {
  where?: MagazineFindAllWhereOptions | MagazineFindAllWhereOptions[];
}

export interface MagazineCommentFindAllOptions
  extends AbstractEntityFindOneOptions {}

export interface MagazineCommentFindOneOptions
  extends AbstractEntityFindOneOptions {
  magazineId?: EntityFindOperator<number>;
  userId?: EntityFindOperator<number>;
}

@EntityRepository(Magazine)
export class MagazineRepository extends AbstractEntityRepository<Magazine> {
  public async findOne(options: MagazineFindOneOptions = {}) {
    if (Object.keys(removeNilFromObject(options)).length === 0) return null;

    const qb = this.repository
      .createQueryBuilder("Magazine")
      .leftJoinAndSelect("Magazine.user", "user");

    this.queryApplier.apply({
      qb,
      where: options,
      buildWhereOptions: ({ filterQuery, where }) => {
        const { id } = where;
        filterQuery("Magazine.id", id);
      },
    });

    return qb.getOne();
  }

  public async findAll(
    options: MagazineFindAllOptions = {}
  ): Promise<IPagination<Magazine>> {
    const { where, skip, take } = options;

    const qb = this.createQueryBuilder("Magazine").leftJoinAndSelect(
      "Magazine.user",
      "user"
    );

    this.queryApplier.apply({
      qb,
      where,
      buildWhereOptions: ({ filterQuery, where }) => {
        const {} = where;
      },
    });

    qb.skip(skip ?? 0);
    qb.take(take ?? 20);

    qb.orderBy("Magazine.id", "DESC");

    const [items, total] = await qb.getManyAndCount();

    return { items, total };
  }

  public async findOneMagazineComment(
    options: MagazineCommentFindOneOptions = {}
  ) {
    if (Object.keys(removeNilFromObject(options)).length === 0) return null;

    const magazineCommentRepository =
      this.manager.getRepository(MagazineComment);
    const qb = magazineCommentRepository.createQueryBuilder("MagazineComment");

    this.queryApplier.apply({
      qb,
      where: options,
      buildWhereOptions: ({ filterQuery, where }) => {
        const { id, userId, magazineId } = where;

        filterQuery("MagazineComment.id", id);
        filterQuery("MagazineComment.userId", userId);
        filterQuery("MagazineComment.magazineId", magazineId);
      },
    });

    return qb.getOne();
  }

  public async findAllMagazineComment(
    options: MagazineCommentFindAllOptions = {}
  ) {
    const magazineCommentRepository =
      this.manager.getRepository(MagazineComment);
    const qb = magazineCommentRepository
      .createQueryBuilder("MagazineComment")
      .leftJoinAndSelect("MagazineComment.user", "user");

    this.queryApplier.apply({
      qb,
      where: options,
      buildWhereOptions: ({ filterQuery, where }) => {
        const { id } = where;

        filterQuery("MagazineComment.magazineId", id);
      },
    });

    return qb.getMany();
  }

  public async saveMagazineComment(entity: DeepPartial<MagazineComment>) {
    const magazineCommentRepository =
      this.manager.getRepository(MagazineComment);
    return magazineCommentRepository.save(entity);
  }

  public async updateMagazineComment(
    criteria: number | number[] | FindConditions<MagazineComment>,
    partialEntity: QueryDeepPartialEntity<MagazineComment>
  ) {
    const magazineCommentRepository =
      this.manager.getRepository(MagazineComment);
    return magazineCommentRepository.update(criteria, partialEntity);
  }

  public async deleteMagazineComment(
    options: number | number[] | FindConditions<MagazineComment>
  ) {
    const magazineCommentRepository =
      this.manager.getRepository(MagazineComment);
    await magazineCommentRepository.delete(options);
  }
}
