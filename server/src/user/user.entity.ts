import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { UserProfile } from './user-profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: true })
  linkedinId: string;

  @Column({ nullable: true }) 
  displayName: string;

  @Column()
  email: string;

  
  @Column({ nullable: true }) // Add the photo field
  photo: string;

  @Column({ nullable: true })
  password: string;

  @OneToOne(() => UserProfile, (profile) => profile.user, {eager: true})
  profile: UserProfile;


}

