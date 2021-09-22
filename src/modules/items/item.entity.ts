import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
} from "typeorm";

@Entity({ name: "item" })
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar" })
  photo: string;

  @Column({ type: "varchar" })
  category: string;

  @Column({ type: "varchar" })
  itemDesc: string;

  @CreateDateColumn()
  createdAt: Date;

  constructor(partial?: Partial<Item>) {
    return Object.assign(this, partial);
  }
}
