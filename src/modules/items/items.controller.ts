import { Controller } from "@nestjs/common";
import { CreateItemDto } from "./items.dto";
import { ItemsService } from "./items.service";
import { CurrentUser, ReqUser } from "../auth/auth.decorator";
import { JwtAuthGuard } from "../auth/auth.guard";

@Controller("items")
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}
}
