// auth.service.ts
import { Injectable } from '@nestjs/common'; // Import Injectable here
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(profile: any): Promise<any> {
    console.log('validateUser called with profile:', profile);
  
    let user = await this.usersRepository.findOne({
      where: { linkedinId: profile.linkedinId },
    });
  
    if (!user) {
      user = new User();
    }
  
    // Update the user object with the new data
    user.linkedinId = profile.linkedinId;
    user.displayName = profile.displayName;
    user.email = profile.email;
    user.photo = profile.photo;
  
    // Save the updated user object to the database
    await this.usersRepository.save(user);
  
    const payload = {
      id: user.id,
      linkedinId: user.linkedinId,
      displayName: user.displayName,
      email: user.email,
      photo: user.photo,
    };
    const accessToken = this.jwtService.sign(payload);
    console.log('JWT payload:', payload);
    return {
      user,
      accessToken,
    };
  }
}