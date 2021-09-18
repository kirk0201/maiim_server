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
import { Content } from "./content.entity";
import { ContentComment } from "./content.comment.entity";

export interface ContentFindOneOptions extends AbstractEntityFindOneOptions {}

export interface ContentFindAllWhereOptions {}

export interface ContentFindAllOptions extends AbstractEntityFindAllOptions {
  where?: ContentFindAllWhereOptions | ContentFindAllWhereOptions[];
}

export interface ContentCommentFindAllOptions
  extends AbstractEntityFindOneOptions {}

export interface ContentCommentFindOneOptions
  extends AbstractEntityFindOneOptions {
  contentId?: EntityFindOperator<number>;
  userId?: EntityFindOperator<number>;
}

@EntityRepository(Content)
export class ContentRepository extends AbstractEntityRepository<Content> {
  public async findOne(options: ContentFindOneOptions = {}) {
    if (Object.keys(removeNilFromObject(options)).length === 0) return null;

    const qb = this.repository
      .createQueryBuilder("Content")
      .leftJoinAndSelect("Content.user", "user");

    this.queryApplier.apply({
      qb,
      where: options,
      buildWhereOptions: ({ filterQuery, where }) => {
        const { id } = where;
        filterQuery("Content.id", id);
      },
    });

    return qb.getOne();
  }

  public async findAll(
    options: ContentFindAllOptions = {}
  ): Promise<IPagination<Content>> {
    const { where, skip, take } = options;

    const qb = this.createQueryBuilder("Content").leftJoinAndSelect(
      "Content.user",
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

    qb.orderBy("Content.id", "DESC");

    const [items, total] = await qb.getManyAndCount();

    return { items, total };
  }

  public async findOneContentComment(
    options: ContentCommentFindOneOptions = {}
  ) {
    if (Object.keys(removeNilFromObject(options)).length === 0) return null;

    const contentCommentRepository = this.manager.getRepository(ContentComment);
    const qb = contentCommentRepository.createQueryBuilder("ContentComment");

    this.queryApplier.apply({
      qb,
      where: options,
      buildWhereOptions: ({ filterQuery, where }) => {
        const { id, userId, contentId } = where;

        filterQuery("ContentComment.id", id);
        filterQuery("ContentComment.userId", userId);
        filterQuery("ContentComment.contentId", contentId);
      },
    });

    return qb.getOne();
  }

  public async findAllContentComment(
    options: ContentCommentFindAllOptions = {}
  ) {
    const contentCommentRepository = this.manager.getRepository(ContentComment);
    const qb = contentCommentRepository.createQueryBuilder("ContentComment");

    this.queryApplier.apply({
      qb,
      where: options,
      buildWhereOptions: ({ filterQuery, where }) => {
        const { id } = where;

        filterQuery("ContentComment.contentId", id);
      },
    });

    return qb.getMany();
  }

  public async saveContentComment(entity: DeepPartial<ContentComment>) {
    const contentCommentRepository = this.manager.getRepository(ContentComment);
    return contentCommentRepository.save(entity);
  }

  public async updateContentComment(
    criteria: number | number[] | FindConditions<ContentComment>,
    partialEntity: QueryDeepPartialEntity<ContentComment>
  ) {
    const contentCommentRepository = this.manager.getRepository(ContentComment);
    return contentCommentRepository.update(criteria, partialEntity);
  }

  public async deleteContentComment(
    options: number | number[] | FindConditions<ContentComment>
  ) {
    const contentCommentRepository = this.manager.getRepository(ContentComment);
    await contentCommentRepository.delete(options);
  }
}
