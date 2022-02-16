import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MagazineRepository } from "./magazine.repository";
import { UserRepository } from "../users/user.repository";
import { MagazinesService } from "./magazines.service";
import { MagazinesController } from "./magazines.controller";

@Module({
  imports: [TypeOrmModule.forFeature([MagazineRepository, UserRepository])],
  providers: [MagazinesService],
  controllers: [MagazinesController],
  exports: [MagazinesService],
})
export class MagazinesModule {}
