import { EntityRepository } from "typeorm";
import { removeNilFromObject } from "src/utils/utils";
import { IPagination } from "../crud/pagination";
import {
  AbstractEntityFindAllOptions,
  AbstractEntityFindOneOptions,
  AbstractEntityRepository,
  EntityFindOperator,
} from "../crud/entity.repository";
import { Content } from "./content.entity";

export interface ContentFindOneOptions extends AbstractEntityFindOneOptions {}

export interface ContentFindAllWhereOptions {}

export interface ContentFindAllOptions extends AbstractEntityFindAllOptions {
  where?: ContentFindAllWhereOptions | ContentFindAllWhereOptions[];
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
}
