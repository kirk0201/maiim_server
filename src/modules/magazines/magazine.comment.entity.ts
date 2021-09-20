import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Column,
} from "typeorm";
import { User } from "../users/user.entity";
import { Magazine } from "./magazine.entity";

@Entity({ name: "magazineComment" })
export class MagazineComment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, { onDelete: "CASCADE" })
  @JoinColumn()
  user: User;

  @Column()
  @Index()
  userId: number;

  @ManyToOne((type) => Magazine, { onDelete: "CASCADE" })
  @JoinColumn()
  magazine: Magazine;

  @Column()
  @Index()
  magazineId: number;

  @Column({ type: "varchar" })
  body: string;

  @CreateDateColumn()
  createdAt: Date;

  constructor(partial?: Partial<MagazineComment>) {
    return Object.assign(this, partial);
  }
}
