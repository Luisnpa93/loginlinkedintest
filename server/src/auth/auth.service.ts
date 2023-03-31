import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'; // Import Injectable here
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis'
import { compare } from 'bcrypt'
import { SignUpDto } from '../dto/SignUpDto';
import { EmailVerificationService } from '../email_verification_service/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private EmailVerificationService: EmailVerificationService,
    @InjectRedis() private readonly redisClient: Redis,
    
  ) {}

  private async generateVerificationToken(signUpDto: SignUpDto): Promise<string> {
    const { username, email, password } = signUpDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
    await this.redisClient.set(`verificationToken:${verificationToken}`, JSON.stringify({ username, email, hashedPassword }), 'EX', 60 * 60 * 24); // Expires in 24 hours
    return verificationToken;
  }

  async sendVerificationEmail(email: string, verificationToken: string): Promise<void> {
    await this.EmailVerificationService.sendVerificationEmail(email, verificationToken);
  }
  
  async signUp(signUpDto: SignUpDto): Promise<User> {
    const { username, email, password } = signUpDto;
    const existingUser = await this.usersRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new BadRequestException('Username already taken');
    }
    const newUser = new User();
    newUser.username = username;
    newUser.email = email;
    newUser.password = password;
    const savedUser = await this.usersRepository.save(newUser);
    const verificationToken = await this.generateVerificationToken(savedUser);
    await this.EmailVerificationService.sendVerificationEmail(savedUser.email, verificationToken);
    return savedUser;
  }

  async verifyVerificationToken(verificationToken: string): Promise<User> {
    try {
      const signUpDto = await this.redisClient.get(`verificationToken:${verificationToken}`);
      if (!signUpDto) {
        throw new BadRequestException('Invalid verification token');
      }
      const { username, email, hashedPassword } = JSON.parse(signUpDto) as { username: string, email: string, hashedPassword: string };
      const user = new User();
      user.username = username;
      user.email = email;
      user.password = hashedPassword;
      user.emailVerified = true;
      return await this.usersRepository.save(user);
    } catch (err) {
      throw new BadRequestException('Invalid verification token');
    }
  }
  
  async VerifyEmail(signUpDto: SignUpDto): Promise<void> {
    const existingUserByEmail = await this.usersRepository.findOne({
      where: { email: signUpDto.email, password: Not(IsNull()) },
    });
    if (existingUserByEmail) {
      throw new NotFoundException('Email exists in the database associated with a password');
    }
    const verificationToken = await this.generateVerificationToken(signUpDto);
    const verificationLink = `https://localhost:3001/auth/verify?token=${verificationToken}`;
    await this.EmailVerificationService.sendVerificationEmail(signUpDto.email, verificationLink);
  }

  async CreateOrMergeUser(signUpDto: SignUpDto): Promise<User> {
    const existingUserByEmail = await this.usersRepository.findOne({ where: { email: signUpDto.email } });
    if (existingUserByEmail) {
      existingUserByEmail.username = signUpDto.username;
      existingUserByEmail.password = await bcrypt.hash(signUpDto.password, 10);
      return await this.usersRepository.save(existingUserByEmail);
    } else {
      const newUser = new User();
      newUser.username = signUpDto.username;
      newUser.email = signUpDto.email;
      newUser.password = await bcrypt.hash(signUpDto.password, 10);
      return await this.usersRepository.save(newUser);
    }
  }

  async getUserByLinkedinId(linkedinId: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { linkedinId } });
  }

  async getUserById(id: number): Promise<User> {
    return await this.usersRepository.findOne({where: { id } });
  }

  async createLinkedInUser(profile: any): Promise<any> {
    console.log('validateUser called with profile:', profile);
    let user = await this.usersRepository.findOne({
      where: { linkedinId: profile.linkedinId },
    });
    if (!user) {
      user = new User();
    }
    user.linkedinId = profile.linkedinId;
    user.displayName = profile.displayName;
    user.linkedinEmail = profile.linkedinEmail;
    user.photo = profile.photo;
    await this.usersRepository.save(user);
    const payload = {
      linkedinId: user.linkedinId,
      displayName: user.displayName,
      linkedinEmail: user.linkedinEmail,
      photo: user.photo,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    return {
      user,
      accessToken,
    };
  }

  async login(email: string, password: string) {
    const user = await this.usersRepository.findOne({where: { email} });
    if (user && await bcrypt.compare(password, user.password)) {
      const payload = {
        id: user.id,
        linkedinId: user.linkedinId,
        displayName: user.displayName,
        email: user.email,
        linkedinEmail: user.linkedinEmail,
        photo: user.photo,
      };
      const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
      return {
        user,
        accessToken,
      };
    } else {
      throw new UnauthorizedException('Invalid email or password');
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: [{ email }, { linkedinEmail: email }],
    });
    if (user && (await compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async CreateOrMergeLinkedIn(user: any): Promise<any> {
    const existingUserByEmail = await this.usersRepository.findOne({ where: { linkedinEmail: user.linkedinEmail } });
    if (existingUserByEmail) {
      existingUserByEmail.linkedinId = user.linkedinId;
      existingUserByEmail.linkedinEmail = user.linkedinId;
      existingUserByEmail.displayName = user.linkedinId;
      existingUserByEmail.photo = user.linkedinId;
      return await this.usersRepository.save(existingUserByEmail);
    } else {
      const newUser = new User();
      newUser.linkedinId = user.linkedinId;
      newUser.linkedinEmail = user.linkedinEmail;
      newUser.displayName = user.displayName;
      newUser.photo= user.photo;
      const savedUser = await this.usersRepository.save(newUser);
      const payload = {
        linkedinId: user.linkedinId,
        displayName: user.displayName,
        linkedinEmail: user.linkedinEmail,
        photo: user.photo,
      };
      const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
      return {
        user: savedUser,
        accessToken,
      };
    }
  }

  async logout(accessToken: string): Promise<any> {
    const expiresIn = 60 * 60; 
    await this.redisClient.set(`invalidated_token:${accessToken}`, 'true', 'EX', expiresIn);
  }
  
  async isTokenInvalidated(accessToken: string | string[]): Promise<boolean> {
    const isInvalidated = await this.redisClient.get(`invalidated_token:${accessToken}`);
    return !!isInvalidated;
  }


}