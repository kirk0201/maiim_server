import { Exclude } from "class-transformer";
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
} from "typeorm";

@Entity({ name: "user" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  email: string;

  @Exclude()
  @Column({ type: "varchar" })
  password: string;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar" })
  nickname: string;

  @Column({ type: "varchar" })
  birth: string;

  @Column({ type: "varchar" })
  phone: string;

  @Column({ type: "varchar" })
  address: string;

  @Column({ type: "integer" })
  gender: number;

  @CreateDateColumn()
  createdAt: Date;

  constructor(partial?: Partial<User>) {
    return Object.assign(this, partial);
  }
}
