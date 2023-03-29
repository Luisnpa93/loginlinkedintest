// auth.service.ts
import { Injectable } from '@nestjs/common'; // Import Injectable here
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './create-user.dto';
import * as bcrypt from 'bcrypt';
import { Redis } from 'ioredis';
import { Inject } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { compare } from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    @InjectRedis() private readonly redisClient: Redis,
  
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && (await compare(password, user.password))) {
      // Remove the password from the returned user object
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async validateLinkedinUser(profile: any): Promise<any> {
    console.log('validateLinkedUser called with profile:', profile);
  
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
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });

    console.log('JWT payload:', payload);
    return {
      user,
      accessToken,
    };
  }


/////////////////////////////
async login(user: any) {
  const payload = {
    id: user.id,
    linkedinId: user.linkedinId,
    displayName: user.displayName,
    email: user.email,
    photo: user.photo,
  };
  const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });

  return {
    user,
    accessToken,
  };
}

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    const user = new User();
    user.email = createUserDto.email;
    user.password = await bcrypt.hash(createUserDto.password, 10);
    // Set other fields as needed
  
    await this.usersRepository.save(user);
    return user;
  }


  async validateUserPassword(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      // Return user without the password field
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async linkUserWithLinkedin(profile: any, userId: number): Promise<any> {
    // ...
    let user = await this.usersRepository.findOne({ where: { id: userId } });
  
    if (user) {
      // Update the user object with the new data
      user.linkedinId = profile.linkedinId;
      user.displayName = profile.displayName;
      user.photo = profile.photo;
  
      // Save the updated user object to the database
      await this.usersRepository.save(user);
    }
    // ...
  }

  async logout(user: any): Promise<any> {
    const token = user.accessToken;
    const expiresIn = 60 * 60; // 1 hour (same as the JWT token expiration time)
    await this.redisClient.set(`invalidated_token:${token}`, 'true', 'EX', expiresIn);
  }

  async isTokenInvalidated(token: string): Promise<boolean> {
    const isInvalidated = await this.redisClient.get(`invalidated_token:${token}`);
    return !!isInvalidated;
  }
}