import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from '../entities/user-profile.entity';
import { User } from '../entities/user.entity';

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
    console.log('user......: ', user);
    if (!user) {
      throw new Error('User not found');
    }
  

    const profile = user.profile? await this.userProfileRepository.findOne({where: { id: user.profile.id}}):new UserProfile();

    profile.nickname = data.nickname;
    profile.occupation = data.occupation;
    profile.user = user;
  
    await this.userProfileRepository.save(profile);
  
    return profile;
  }

  async getUserByProp(property: string, value: string): Promise<User> {
    // Retrieve user by property and value from database
    const user = await this.userRepository.findOne({where: { [property]: value }});
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  
}