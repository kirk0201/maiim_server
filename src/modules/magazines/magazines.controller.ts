import { Controller } from "@nestjs/common";
import { CurrentUser, ReqUser } from "../auth/auth.decorator";
import { CreateMagazineDto } from "./magazines.dto";
import { MagazinesService } from "./magazines.service";
import { JwtAuthGuard } from "../auth/auth.guard";

@Controller("magazines")
export class MagazinesController {
  constructor(private readonly magazineService: MagazinesService) {}
}
