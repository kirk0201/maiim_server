import { EntityRepository } from "typeorm";
import { removeNilFromObject } from "src/utils/utils";
import { IPagination } from "../crud/pagination";
import {
  AbstractEntityFindAllOptions,
  AbstractEntityFindOneOptions,
  AbstractEntityRepository,
} from "../crud/entity.repository";
import { Magazine } from "./magazine.entity";

export interface MagazineFindOneOptions extends AbstractEntityFindOneOptions {}

export interface MagazineFindAllWhereOptions {}

export interface MagazineFindAllOptions extends AbstractEntityFindAllOptions {
  where?: MagazineFindAllWhereOptions | MagazineFindAllWhereOptions[];
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
}
