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

@Entity({ name: "content" })
export class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, { onDelete: "RESTRICT" })
  @JoinColumn()
  user: User;

  @Column()
  @Index()
  userId: number;

  @Column({ type: "varchar" })
  tag: string;

  @Column({ type: "varchar" })
  title: string;

  @Column({ type: "varchar" })
  body: string;

  @CreateDateColumn()
  createdAt: Date;

  constructor(partial?: Partial<Content>) {
    return Object.assign(this, partial);
  }
}
