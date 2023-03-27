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
    let user = await this.usersRepository.findOne({ where: { linkedinId: profile.linkedinId } }); // Use where inside the findOne method

    if (!user) {
      user = new User();
      user.linkedinId = profile.linkedinId;
      user.displayName = profile.displayName;
      user.email = profile.email;
      await this.usersRepository.save(user);
    }

    const payload = { sub: user.linkedinId, displayName: user.displayName, email: user.email };
    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
