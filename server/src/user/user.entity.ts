// user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  linkedinId: string;

  @Column()
  displayName: string;

  @Column()
  email: string;
}
