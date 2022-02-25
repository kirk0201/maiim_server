import { EntityRepository } from "typeorm";
import { removeNilFromObject } from "src/utils/utils";
import { IPagination } from "../crud/pagination";
import { User } from "./user.entity";
import {
  AbstractEntityFindAllOptions,
  AbstractEntityFindOneOptions,
  AbstractEntityRepository,
  EntityFindOperator,
} from "../crud/entity.repository";

export interface UserFindOneOptions extends AbstractEntityFindOneOptions {
  email?: EntityFindOperator<string>;
  nickname?: EntityFindOperator<string>;
  name?: EntityFindOperator<string>;
  phone?: EntityFindOperator<string>;
}

export interface UserFindAllWhereOptions {}

export interface UserFindAllOptions extends AbstractEntityFindAllOptions {
  where?: UserFindAllWhereOptions | UserFindAllWhereOptions[];
}

@EntityRepository(User)
export class UserRepository extends AbstractEntityRepository<User> {
  public async findOne(options: UserFindOneOptions = {}) {
    if (Object.keys(removeNilFromObject(options)).length === 0) return null;

    const qb = this.repository.createQueryBuilder("User");

    this.queryApplier.apply({
      qb,
      where: options,
      buildWhereOptions: ({ filterQuery, where }) => {
        const { id, email, nickname, name, phone } = where;
        filterQuery("User.id", id);
        filterQuery("User.email", email);
        filterQuery("User.nickname", nickname);
        filterQuery("User.name", name);
        filterQuery("User.phone", phone);
      },
    });

    return qb.getOne();
  }

  public async findAll(
    options: UserFindAllOptions = {}
  ): Promise<IPagination<User>> {
    const { where, skip, take } = options;

    const qb = this.createQueryBuilder("User");

    this.queryApplier.apply({
      qb,
      where,
      buildWhereOptions: ({ filterQuery, where }) => {
        const {} = where;
      },
    });

    qb.skip(skip ?? 0);
    qb.take(take ?? 20);

    qb.orderBy("User.id", "DESC");

    const [items, total] = await qb.getManyAndCount();

    return { items, total };
  }
}
