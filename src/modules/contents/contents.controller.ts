import { Controller } from "@nestjs/common";
import { CurrentUser, ReqUser } from "../auth/auth.decorator";
import { ContentsService } from "./contents.service";

@Controller("contents")
export class ContentsController {
  constructor(private readonly contentService: ContentsService) {}
}
