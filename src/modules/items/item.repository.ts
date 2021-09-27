import { EntityRepository } from "typeorm";
import { removeNilFromObject } from "src/utils/utils";
import { IPagination } from "../crud/pagination";
import { Item } from "./item.entity";
import {
  AbstractEntityFindAllOptions,
  AbstractEntityFindOneOptions,
  AbstractEntityRepository,
  EntityFindOperator,
} from "../crud/entity.repository";

export interface ItemFindOneOptions extends AbstractEntityFindOneOptions {}

export interface ItemFindAllOptions extends AbstractEntityFindAllOptions {
  category?: EntityFindOperator<string>;
}

@EntityRepository(Item)
export class ItemRepository extends AbstractEntityRepository<Item> {
  public async findOne(options: ItemFindOneOptions = {}) {
    if (Object.keys(removeNilFromObject(options)).length === 0) return null;

    const qb = this.repository.createQueryBuilder("Item");

    this.queryApplier.apply({
      qb,
      where: options,
      buildWhereOptions: ({ filterQuery, where }) => {
        const { id } = where;
        filterQuery("Item.id", id);
      },
    });

    return qb.getOne();
  }

  public async findAll(
    options: ItemFindAllOptions = {}
  ): Promise<IPagination<Item>> {
    const { skip, take } = options;

    const qb = this.createQueryBuilder("Item");

    this.queryApplier.apply({
      qb,
      where: options,
      buildWhereOptions: ({ filterQuery, where }) => {
        const { category } = where;
        filterQuery("Item.category", category);
      },
    });

    qb.skip(skip ?? 0);
    qb.take(take ?? 20);

    qb.orderBy("Item.id", "DESC");

    const [items, total] = await qb.getManyAndCount();

    return { items, total };
  }
}
