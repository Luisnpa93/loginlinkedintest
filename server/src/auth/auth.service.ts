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
      user.linkedinId = profile.linkedinId;
      user.displayName = profile.displayName;
      user.email = profile.email;
      await this.usersRepository.save(user);
    }
  
    const payload = {
      id: user.id, // Include the integer user ID
      linkedinId: user.linkedinId, // Include the LinkedIn ID
      displayName: user.displayName,
      email: user.email,
    };
    const accessToken = this.jwtService.sign(payload);
    console.log('JWT payload:', payload); // Log the JWT payload
    return {
      user,
      accessToken,
    };
  }
}