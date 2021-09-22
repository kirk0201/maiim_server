import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ItemRepository } from "./item.repository";
import { ItemsService } from "./items.service";
import { ItemsController } from "./items.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ItemRepository])],
  providers: [ItemsService],
  controllers: [ItemsController],
  exports: [ItemsService],
})
export class ItemsModule {}
