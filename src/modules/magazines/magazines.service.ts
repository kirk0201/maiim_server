import { Injectable } from "@nestjs/common";
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
}
