import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { UserProfile } from './user-profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true }) // Update the type to 'varchar'
  linkedinId: string;

  @Column()
  displayName: string;

  @Column()
  email: string;

  @Column({ nullable: true }) // Add the photo field
  photo: string;

  @OneToOne(() => UserProfile, (profile) => profile.user, {eager: true})
  profile: UserProfile;
}

