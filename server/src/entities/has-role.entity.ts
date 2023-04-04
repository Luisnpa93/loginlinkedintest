import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type RoleName = 'superadmin' | 'admin' | 'content manager' | 'standard';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['superadmin', 'admin', 'content manager', 'standard'],
    default: 'standard',
  })
  name: RoleName;

  @Column()
  description: string;
}
