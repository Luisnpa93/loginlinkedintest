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
import { EmailService } from '../emailservice/email.service';
import { LinkedInUserDto } from 'src/dto/linkedIn-user.dto';
import { JwtPayload, LinkedInPayload } from 'src/types';
import { HasRoleService } from 'src/role/has-role.service';



@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly roleService: HasRoleService,
    private emailVerificationService: EmailService,
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
    await this.emailVerificationService.sendVerificationEmail(email, verificationToken);
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
    await this.emailVerificationService.sendVerificationEmail(savedUser.email, verificationToken);
    return savedUser;
  }

  async verifyVerificationToken(verificationToken: string): Promise<User> {
    try {
      const signUpDto = await this.redisClient.get(`verificationToken:${verificationToken}`);
      console.log("verification tolen", verificationToken)
      console.log("signupdto", signUpDto)
      if (!signUpDto) {
        throw new BadRequestException('Invalid verification token');
      }
      const { username, email, hashedPassword } = JSON.parse(signUpDto) as { username: string, email: string, hashedPassword: string };
      const user = new User();
      user.username = username;
      user.email = email;
      user.password = hashedPassword;
      user.emailVerified = true;
      const roleName = 'standard';
      let defaultRole;
      try {
        defaultRole = await this.roleService.findOneByName(roleName);
      } catch (error) {
        console.error('Error while fetching role:', error);
        throw new BadRequestException('Error while fetching role');
      }
      user.role = defaultRole;
      console.log("role is : ", user.role);
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
    await this.emailVerificationService.sendVerificationEmail(signUpDto.email, verificationLink);
  }

  async createOrMergeUser(signUpDto: SignUpDto): Promise<User> {
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

  async create(user: Partial<User>): Promise<User> {
    const newUser = new User();
    newUser.username = user.username;
    newUser.email = user.email;
    newUser.password = await bcrypt.hash(user.password, 10);
    if (user.role) {
      const role = await this.roleService.findOne({ where: { name: user.role.name } });
      if (role) {
        newUser.role = role;
      }
    }
    return await this.usersRepository.save(newUser);
  }
  
  
  


  async getUserByLinkedinId(linkedinId: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { linkedinId } });
  }

  

  
  async getUserById(id: number): Promise<User> {
    return await this.usersRepository.findOne({where: { id } });
  }

 private async createAccessToken(payload: JwtPayload): Promise<string> {
    return await this.jwtService.sign(payload, {expiresIn: '1h'})
  }
  
  async login(email: string, password: string) {
    const user = await this.usersRepository.findOne({where: { email} });
    if (user && await User.comparePasswords(password, user.password)) {
      const payload = {
        id: user.id,
        linkedinId: user.linkedinId,
        displayName: user.displayName,
        email: user.email,
        linkedinEmail: user.linkedinEmail,
        photo: user.photo,
      };
      const accessToken = await this.createAccessToken(payload);
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
 
  async getUserAndToken(user: User): Promise<LinkedInPayload> {
    const payload: JwtPayload = {
      id: user.id,
      linkedinId: user.linkedinId,
      displayName: user.displayName,
      email: user.email,
      linkedinEmail: user.linkedinEmail,
      photo: user.photo,
    };
    const accessToken = await this.createAccessToken(payload);  
    return {user, accessToken}
  }

  async createOrMergeLinkedIn(user: LinkedInUserDto): Promise<any> {
    const existingUserByEmail = await this.usersRepository.findOne({
      where: [
        { email: user.linkedinEmail },
        { linkedinEmail: user.linkedinEmail },
      ],
    });
    let savedUser: User;
    if (existingUserByEmail) {
      existingUserByEmail.linkedinId = user.linkedinId;
      existingUserByEmail.linkedinEmail = user.linkedinEmail;
      existingUserByEmail.displayName = user.displayName;
      existingUserByEmail.photo = user.photo;
      savedUser = await this.usersRepository.save(existingUserByEmail);
    } else {
      const newUser = new User();
      newUser.linkedinId = user.linkedinId;
      newUser.linkedinEmail = user.linkedinEmail;
      newUser.displayName = user.displayName;
      newUser.photo = user.photo;
      const roleName = 'standard';
      const defaultRole = await this.roleService.findOneByName(roleName);
      if (!defaultRole) {
        throw new NotFoundException(`Role ${roleName} not found`);
      }
      newUser.role = defaultRole;
      savedUser = await this.usersRepository.save(newUser);
    }
    const payload: JwtPayload = {
      id: savedUser.id,
      linkedinId: savedUser.linkedinId,
      displayName: savedUser.displayName,
      email: savedUser.email,
      linkedinEmail: savedUser.linkedinEmail,
      photo: savedUser.photo,
    };
    const accessToken = await this.createAccessToken(payload);
    return { user: savedUser, accessToken };
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