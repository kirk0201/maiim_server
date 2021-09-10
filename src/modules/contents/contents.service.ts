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
import { CreateContentDto } from "./contents.dto";

@Injectable()
export class ContentsService {
  constructor(private readonly contentRepository: ContentRepository) {}

  public async create(createContentDto: CreateContentDto, userId: number) {
    const { tag, title, body } = createContentDto;

    if (title.length > 30)
      throw new ForbiddenException("제목은 30자를 넘을 수 없습니다.");

    const content = new Content({ tag, title, body, userId });
    await this.contentRepository.save(content);
    return this.contentRepository.findOne({ id: content.id });
  }

  public async findOne(options?: ContentFindOneOptions) {
    const content = await this.contentRepository.findOne(options);
    if (!content) throw new NotFoundException("게시물이 없습니다");
    return content;
  }

  public async findAll(options?: ContentFindAllOptions) {
    return this.contentRepository.findAll(options);
  }

  public async update(content: any, contentId: number, userId: number) {
    const findContent = await this.contentRepository.findOne({ id: contentId });

    if (!findContent) throw new NotFoundException("해당 게시물이 없습니다");

    if (findContent.userId !== userId)
      throw new UnauthorizedException("권한이 없습니다");

    await this.contentRepository.update(contentId, content);
  }

  public async delete(contentId: number, userId: number) {
    const findContent = await this.contentRepository.findOne({ id: contentId });

    if (!findContent) throw new NotFoundException("해당 게시물이 없습니다");

    if (findContent.userId !== userId)
      throw new UnauthorizedException("권한이 없습니다");

    await this.contentRepository.delete(contentId);
  }
}
