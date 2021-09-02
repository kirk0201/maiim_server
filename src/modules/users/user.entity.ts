import { Exclude, Expose } from 'class-transformer'
import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    Column,
  } from 'typeorm'
  
@Entity({ name: 'user' })
@Exclude()  
export class User {
  @PrimaryGeneratedColumn()
  @Expose({ groups: ['me'] })  
  id: number
  
  @Column({ type: "varchar" })
  @Expose({ groups: ['me'] })  
  email: string
    
  @Column({ type: "varchar" })
  password: string

  @Column({ type: "varchar" })
  @Expose({ groups: ['me'] })  
  name: string
  
  @Column({ type: "varchar" })
  @Expose({ groups: ['me'] })  
  nickname: string
      
  @Column({ type: "varchar" })
  @Expose({ groups: ['me'] })  
  birth: string
    
  @Column({ type: "varchar" })
  @Expose({ groups: ['me'] })  
  phone: string
    
  @Column({ type: "varchar" })
  @Expose({ groups: ['me'] })  
  address: string
    
  @Column({ type: "integer" })
  @Expose({ groups: ['me'] })  
  gender: number  
  
  @CreateDateColumn()
  @Expose({ groups: ['me'] })  
  createdAt: Date

  constructor(partial?: Partial<User>) {
    return Object.assign(this, partial)
  }
}
  
