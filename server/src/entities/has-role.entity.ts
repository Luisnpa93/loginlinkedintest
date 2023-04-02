import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

export type RoleName = 'admin' | 'content manager' | 'standard';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['admin', 'content manager', 'standard'],
    default: 'standard',
  })
  name: RoleName;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.role)
  user: User;
}
