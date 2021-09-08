import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MagazineRepository } from "./magazine.repository";
import { MagazinesService } from "./magazines.service";
import { MagazinesController } from "./magazines.controller";

@Module({
  imports: [TypeOrmModule.forFeature([MagazineRepository])],
  providers: [MagazinesService],
  controllers: [MagazinesController],
  exports: [MagazinesService],
})
export class MagazinesModule {}
