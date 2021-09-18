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
import { Content } from "./content.entity";

@Entity({ name: "contentComment" })
export class ContentComment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, { onDelete: "CASCADE" })
  @JoinColumn()
  user: User;

  @Column()
  @Index()
  userId: number;

  @ManyToOne((type) => Content, { onDelete: "CASCADE" })
  @JoinColumn()
  content: Content;

  @Column()
  @Index()
  contentId: number;

  @Column({ type: "varchar" })
  body: string;

  @CreateDateColumn()
  createdAt: Date;

  constructor(partial?: Partial<ContentComment>) {
    return Object.assign(this, partial);
  }
}
