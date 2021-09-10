import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Magazine } from "./magazine.entity";
import {
  MagazineFindAllOptions,
  MagazineFindOneOptions,
  MagazineRepository,
} from "./magazine.repository";
import { CreateMagazineDto } from "./magazines.dto";

@Injectable()
export class MagazinesService {
  constructor(private readonly magazineRepository: MagazineRepository) {}

  public async create(createMagazineDto: CreateMagazineDto, userId: number) {
    const { photo, title, body } = createMagazineDto;

    if (title.length > 30)
      throw new ForbiddenException("제목은 30자를 넘을 수 없습니다.");

    const magazine = new Magazine({ photo, title, body, userId });
    await this.magazineRepository.save(magazine);
    return this.magazineRepository.findOne({ id: magazine.id });
  }

  public async findOne(options?: MagazineFindOneOptions) {
    const magazine = await this.magazineRepository.findOne(options);
    if (!magazine) throw new NotFoundException("매거진이 없습니다");
    return magazine;
  }

  public async findAll(options?: MagazineFindAllOptions) {
    return this.magazineRepository.findAll(options);
  }

  public async update(magazine: any, magazineId: number, userId: number) {
    const findMagazine = await this.magazineRepository.findOne({
      id: magazineId,
    });

    if (!findMagazine) throw new NotFoundException("해당 매거진이 없습니다");

    if (findMagazine.userId !== userId)
      throw new UnauthorizedException("권한이 없습니다");

    await this.magazineRepository.update(magazineId, magazine);
  }

  public async delete(magazineId: number, userId: number) {
    console.log(magazineId, userId);
    const findMagazine = await this.magazineRepository.findOne({
      id: magazineId,
    });

    if (!findMagazine) throw new NotFoundException("해당 매거진이 없습니다");

    if (findMagazine.userId !== userId)
      throw new UnauthorizedException("권한이 없습니다");

    await this.magazineRepository.delete(magazineId);
  }
}
