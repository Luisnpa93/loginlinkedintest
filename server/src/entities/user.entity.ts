import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, BeforeInsert } from 'typeorm';
import { Role } from './has-role.entity';
import { UserProfile } from './user-profile.entity';
import * as bcrypt from 'bcrypt';

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

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ nullable: true, unique: true })
  linkedinEmail: string;

  @Column({ nullable: true }) 
  photo: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: false })
  emailVerified: boolean;
  
  @OneToOne(() => UserProfile, (profile) => profile.user, {eager: true})
  profile: UserProfile;

  @ManyToOne(() => Role,{ eager: true })
  role: Role;

  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  static async comparePasswords(
    candidatePassword: string,
    hashedPassword: string
  ) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}




