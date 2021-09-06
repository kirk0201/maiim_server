import { isNil, some } from "lodash";
import {
  DeepPartial,
  AbstractRepository,
  FindConditions,
  WhereExpressionBuilder,
  Brackets,
  FindOperator,
} from "typeorm";
import { IPagination } from "./pagination";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

/*
 *Type 은 리터럴 타입의 값에만 사용하고,
 *Object 형태의 타입을 잡아줄 때는 Interface 를 사용한다.
 */

// FindOperator = 조건 찾기에 사용되는 찾기 연산자입니다.
export type EntityFindOperator<T> = T | FindOperator<T>;

export interface AbstractEntityFindOneOptions {
  id?: EntityFindOperator<number>;
}

// createQueryBuilder가 아닌 find() 함수를 사용할 때 Pagination
export interface AbstractEntityFindAllOptions {
  skip?: number; // 시작 인덱스 지정 (0부터 시작)
  take?: number; // 페이지 당 갯수 지정
}

export abstract class AbstractEntityRepository<
  T
> extends AbstractRepository<T> {
  protected readonly queryApplier: EntityQueryApplier;

  constructor() {
    super();
    this.queryApplier = new EntityQueryApplier();
  }
  public abstract findAll(
    options?: AbstractEntityFindAllOptions
  ): Promise<IPagination<T>>;

  public abstract findOne(options?: AbstractEntityFindOneOptions): Promise<T>;

  public async save(entity: DeepPartial<T>) {
    return this.repository.save(entity);
  }

  public async update(
    criteria: number | number[] | FindConditions<T>,
    partialEntity: QueryDeepPartialEntity<T>
  ) {
    return this.repository.update(criteria, partialEntity);
  }

  public async delete(options: number | number[] | FindConditions<T>) {
    await this.repository.delete(options);
  }
}

// 뭔지 모르겠음
export interface BuildWhereOptionsFunction<T> {
  ({
    filterQuery,
    where,
  }: {
    filterQuery: (property: string, valueOrOperator: any) => void;
    where: T;
  }): void;
}

export interface ApplyOptions<T> {
  qb: WhereExpressionBuilder;
  where?: T | T[];
  buildWhereOptions: BuildWhereOptionsFunction<T>;
}

// 뭔지 모르겠음
class EntityQueryApplier {
  /**
   * 컨디션을 검사하여 불필요한 where문을 필터링하여 쿼리를 적용한다.
   * @param param0
   * @returns
   */
  public apply<T>({ qb, where, buildWhereOptions }: ApplyOptions<T>) {
    if (!where) return;

    // 전체 컨디션 검사
    if (Array.isArray(where)) {
      // 하나라도 유효하면 진행한다.
      if (
        some(where, (where) =>
          this.checkConditionValid({ where, buildWhereOptions })
        )
      ) {
        qb.andWhere(
          new Brackets((qb) => {
            where.forEach((wh) => {
              // 각각 유효한지 검토 후 진행
              if (this.checkConditionValid({ where: wh, buildWhereOptions }))
                qb.orWhere(
                  new Brackets((qb) => {
                    this.applyBuildOptions({
                      qb,
                      where: wh,
                      buildWhereOptions,
                    });
                  })
                );
            });
          })
        );
      }
    } else {
      if (this.checkConditionValid({ where, buildWhereOptions }))
        this.applyBuildOptions({ qb, where, buildWhereOptions });
    }
  }

  private applyBuildOptions<T>({
    qb,
    where,
    buildWhereOptions,
  }: {
    qb: WhereExpressionBuilder;
    where: T;
    buildWhereOptions: BuildWhereOptionsFunction<T>;
  }) {
    buildWhereOptions({
      where,
      filterQuery: (property, valueOrOperator) => {
        if (isNil(valueOrOperator)) return;
        qb.andWhere(
          this.computeFindOperatorExpression(property, valueOrOperator)
        );
      },
    });
  }

  /**
   * 해당 buildWhereOptions 내에 filterQuery를 통해 한번이라도 유효하게 andQuery가 걸리는지 확인한다.
   * @param where
   * @returns
   */
  private checkConditionValid<T>({
    where,
    buildWhereOptions,
  }: {
    where: T;
    buildWhereOptions: BuildWhereOptionsFunction<T>;
  }) {
    let isValid = false;

    buildWhereOptions({
      where,
      filterQuery: (condition) => {
        if (condition) isValid = true;
      },
    });

    return isValid;
  }

  /**
   * 컬럼과 비교값에 대한 Raw Query를 계산하여 반환해준다.
   * @param property Column 이름
   * @param operator FindOperator 또는 직접 값(Equal)
   * @returns
   */
  private computeFindOperatorExpression(
    property: string,
    operator: FindOperator<any> | any
  ) {
    const wrappedValue = (value: any) => {
      // 큰 따옴표 파싱
      if (typeof value === "string") return `"${value.replace(/"/g, '\\"')}"`;
      else if (value instanceof Date) return `"${value.toISOString()}"`;

      return value;
    };

    if (!(operator instanceof FindOperator))
      return `${property} = ${wrappedValue(operator)}`;

    switch (operator.type) {
      case "not":
        if (operator.child) {
          return `NOT(${this.computeFindOperatorExpression(
            property,
            operator.child
          )})`;
        } else {
          return `${property} != ${wrappedValue(operator.value)}`;
        }
      case "lessThan":
        return `${property} < ${wrappedValue(operator.value)}`;
      case "lessThanOrEqual":
        return `${property} <= ${wrappedValue(operator.value)}`;
      case "moreThan":
        return `${property} > ${wrappedValue(operator.value)}`;
      case "moreThanOrEqual":
        return `${property} >= ${wrappedValue(operator.value)}`;
      case "equal":
        return `${property} = ${wrappedValue(operator.value)}`;
      case "like":
        return `${property} LIKE ${wrappedValue(operator.value)}`;
      case "between":
        return `${property} BETWEEN ${wrappedValue(
          operator.value[0]
        )} AND ${wrappedValue(operator.value[1])}`;
      case "in":
        if (operator.value.length === 0) {
          return "0=1";
        }
        return `${property} IN (${operator.value
          .map((v) => wrappedValue(v))
          .join(", ")})`;
      case "any":
        return `${property} = ANY(${wrappedValue(operator.value)})`;
      case "isNull":
        return `${property} IS NULL`;
    }

    throw new TypeError(
      `Unsupported FindOperator ${FindOperator.constructor.name}`
    );
  }
}
