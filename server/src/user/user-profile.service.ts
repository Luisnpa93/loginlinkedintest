import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from './user-profile.entity';
import { User } from './user.entity';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createProfile(data: { nickname: string; occupation: string }, userId: number) {
    console.log('Received userId in createProfile:', userId); // Log the userId value

    const user = await this.userRepository.findOne({ where: { id: userId } }); // Use 'id' instead of 'linkedinId'
  
    if (!user) {
      throw new Error('User not found');
    }
  
    const profile = new UserProfile();
    profile.nickname = data.nickname;
    profile.occupation = data.occupation;
    profile.user = user;
  
    await this.userProfileRepository.save(profile);
  
    return profile;
  }
}