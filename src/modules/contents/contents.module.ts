import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContentRepository } from "./content.repository";
import { ContentsService } from "./contents.service";
import { ContentsController } from "./contents.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ContentRepository])],
  providers: [ContentsService],
  controllers: [ContentsController],
  exports: [ContentsService],
})
export class ContentsModule {}
