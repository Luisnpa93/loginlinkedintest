// has-role.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
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
}
