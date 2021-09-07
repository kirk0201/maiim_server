import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Content } from "./content.entity";
import {
  ContentFindAllOptions,
  ContentFindOneOptions,
  ContentRepository,
} from "./content.repository";

@Injectable()
export class ContentsService {
  constructor(private readonly contentRepository: ContentRepository) {}
}
