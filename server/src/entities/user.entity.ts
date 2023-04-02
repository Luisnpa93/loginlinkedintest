import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToMany, JoinTable, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from './has-role.entity';
import { UserProfile } from './user-profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true }) 
  username: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  linkedinId: string;

  @Column({ nullable: true }) 
  displayName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  linkedinEmail: string;

  @Column({ nullable: true }) 
  photo: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: false })
  emailVerified: boolean;
  
  @OneToOne(() => UserProfile, (profile) => profile.user, {eager: true})
  profile: UserProfile;

  @ManyToOne(() => Role, (role) => role.user)
  role: Role;

}