import { Injectable } from "@nestjs/common";
import { CreateItemDto } from "./items.dto";
import {
  ItemRepository,
  ItemFindOneOptions,
  ItemFindAllOptions,
} from "./item.repository";
import { Item } from "./item.entity";

@Injectable()
export class ItemsService {
  constructor(private readonly itemRepository: ItemRepository) {}
}
