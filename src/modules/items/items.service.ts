import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateItemDto } from "./items.dto";
import {
  ItemRepository,
  ItemFindOneOptions,
  ItemFindAllOptions,
} from "./item.repository";
import { UserRepository } from "../users/user.repository";
import { Item } from "./item.entity";

@Injectable()
export class ItemsService {
  constructor(
    private readonly itemRepository: ItemRepository,
    private readonly userRepository: UserRepository
  ) {}

  public async create(createItemDto: CreateItemDto, userId: number) {
    const { name, photo, category, itemDesc } = createItemDto;

    const item = new Item({ name, photo, category, itemDesc });

    const findManager = await this.userRepository.findOne({ id: userId });

    if (findManager.name !== "김대원")
      throw new UnauthorizedException("권한이 없습니다.");

    await this.itemRepository.save(item);
    return this.itemRepository.findOne({ id: item.id });
  }

  public async findOne(options?: ItemFindOneOptions) {
    const item = await this.itemRepository.findOne(options);
    if (!item) throw new NotFoundException("상품이 없습니다.");
    return item;
  }

  public async findAll(options?: ItemFindAllOptions) {
    return this.itemRepository.findAll(options);
  }

  public async update(item: any, itemId: number, userId: number) {
    const findItem = await this.itemRepository.findOne({ id: itemId });

    if (!findItem) throw new NotFoundException("해당 상품이 없습니다.");

    const findManager = await this.userRepository.findOne({ id: userId });

    if (findManager.name !== "김대원")
      throw new UnauthorizedException("권한이 없습니다.");

    await this.itemRepository.update(itemId, item);
  }

  public async delete(itemId: number, userId: number) {
    const findItem = await this.itemRepository.findOne({ id: itemId });

    if (!findItem) throw new NotFoundException("해당 상품이 없습니다.");

    const findManager = await this.userRepository.findOne({ id: userId });

    if (findManager.name !== "김대원")
      throw new UnauthorizedException("권한이 없습니다.");

    await this.itemRepository.delete(itemId);
  }
}
