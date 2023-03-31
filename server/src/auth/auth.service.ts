// auth.service.ts
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'; // Import Injectable here
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './create-user.dto';
import * as bcrypt from 'bcrypt';
import { Redis } from 'ioredis';
import { Inject } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis'
import { compare } from 'bcrypt'
import { SignUpDto } from './SignUpDto';
import { EmailVerificationService } from '../email/email.service';
import * as nodemailer from 'nodemailer';
import * as sgTransport from 'nodemailer-sendgrid-transport';
import { sign } from 'crypto';

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
    //const user = this.usersRepository.create(signUpDto);
    //await this.usersRepository.save(user);
  
    const verificationToken = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
    await this.redisClient.set(`verificationToken:${verificationToken}`, JSON.stringify(signUpDto), 'EX', 60 * 60 * 24); // Expires in 24 hours
  
    return verificationToken;
  }
  
  
  async sendVerificationEmail(email: string, verificationToken: string): Promise<void> {
    await this.EmailVerificationService.sendVerificationEmail(email, verificationToken);
  }
  



  async saveUser(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const { username, email, password } = signUpDto;

    // Check if the username already exists in the database
    const existingUser = await this.usersRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new BadRequestException('Username already taken');
    }

    // Create a new user with the provided data
    const newUser = new User();
    newUser.username = username;
    newUser.email = email;
    newUser.password = password;
    const savedUser = await this.usersRepository.save(newUser);
    console.log('saved user aslkdjaslkdjsakldjsalkjdsalkdaslkdja', savedUser)
    // Send a verification email to the user's email address
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
      const userDto = JSON.parse(signUpDto) as SignUpDto;
      console.log("signdto",signUpDto);
      console.log("userdto",userDto);
      const user = new User();
      user.username = userDto.username;
      user.email = userDto.email;
      user.password = userDto.password;
      user.emailVerified = true;

      
      return await this.usersRepository.save(user);
     
    } catch (err) {
      throw new BadRequestException('Invalid verification token');
    }
  }
  

  
  async VerifyEmail(signUpDto: SignUpDto): Promise<void> {
    //VERIFY IF EMAIL EXISTS AND HAS A PASSWORD ASSOCIATED
    const existingUserByEmail = await this.usersRepository.findOne({
      where: { email: signUpDto.email, password: Not(IsNull()) },
    });
    console.log('existinguserbyemail:   ', existingUserByEmail)
    // Check if the user exists
    if (existingUserByEmail) {
      throw new NotFoundException('Email exists in the database associated with a password');
    }
  
    /* MAIL VERIFICATION LOGIC */
    // SEND A VERIFICATION EMAIL TO THE USER EMAIL AND WAIT FOR THE USER TO VERIFY IT
    

    const verificationToken = await this.generateVerificationToken(signUpDto);
    console.log('Verification link:', verificationToken);
    const verificationLink = `https://localhost:3001/auth/verify?token=${verificationToken}`;
    await this.EmailVerificationService.sendVerificationEmail(signUpDto.email, verificationLink);
  
    // Wait until the user verifies their email
    
  }

  
  

  
  async CreateOrMergeUser(signUpDto: SignUpDto): Promise<User> {
    //VERIFY IF EMAIL EXISTS IN THE DATABASE - IF WE GET HERE IT MEANS THERE IS NO PASSWORD ASSOCIATED TO IT EVEN IF IT EXISTS
    const existingUserByEmail = await this.usersRepository.findOne({ where: { email: signUpDto.email } });
    
    if (existingUserByEmail) {
      // Merge the new user data with the existing user data
      existingUserByEmail.username = signUpDto.username;
      existingUserByEmail.password = await bcrypt.hash(signUpDto.password, 10);
      return await this.usersRepository.save(existingUserByEmail);
    } else {
      // Create a new user with the provided data
      const newUser = new User();
      newUser.username = signUpDto.username;
      newUser.email = signUpDto.email;
      newUser.password = await bcrypt.hash(signUpDto.password, 10);
      return await this.usersRepository.save(newUser);
    }
}


  
  

  
  async verifyEmail(verificationToken: string): Promise<void> {
    const userIdString = await this.redisClient.get(`verificationToken:${verificationToken}`);
    if (!userIdString) {
      throw new BadRequestException('Invalid verification token');
    }

    const userId = parseInt(userIdString, 10);

    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.emailVerified = true;
    await this.usersRepository.save(user);
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
  
    // Update the user object with the new data
    user.linkedinId = profile.linkedinId;
    user.displayName = profile.displayName;
    user.linkedinEmail = profile.linkedinEmail;
    user.photo = profile.photo;
  
    // Save the updated user object to the database
    await this.usersRepository.save(user);
  
    const payload = {
      
      linkedinId: user.linkedinId,
      displayName: user.displayName,
      
      linkedinEmail: user.linkedinEmail,
      photo: user.photo,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });

    console.log('JWT payload:', payload);
    return {
      user,
      accessToken,
    };
  }

  async login(email: string, password: string) {
    // Find the user with the given email from the database
    const user = await this.usersRepository.findOne({where: { email} });
    
    // Verify that the user exists and that the password matches
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
      console.log('created token ..................................................', accessToken)
      return {
        user,
        accessToken,
      };
    } else {
      // Email or password is incorrect, throw an error
      throw new UnauthorizedException('Invalid email or password');
    }
  }
  
  
  
 

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: [{ email }, { linkedinEmail: email }],
    });
    if (user && (await compare(password, user.password))) {
      // Remove the password from the returned user object
      const { password, ...result } = user;
      return result;
    }
    return null;
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

  async CreateOrMergeLinkedIn(user: any): Promise<any> {
    const existingUserByEmail = await this.usersRepository.findOne({ where: { linkedinEmail: user.linkedinEmail } });
  
    if (existingUserByEmail) {
      // Merge the new user data with the existing user data
      existingUserByEmail.linkedinId = user.linkedinId;
      existingUserByEmail.linkedinEmail = user.linkedinId;
      existingUserByEmail.displayName = user.linkedinId;
      existingUserByEmail.photo = user.linkedinId;
  
      return await this.usersRepository.save(existingUserByEmail);
    } else {
      // Create a new user with the provided data
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
  
      console.log('JWT payload:', payload);
  
      return {
        user: savedUser,
        accessToken,
      };
    }
  }
  

  

  async logout(accessToken: string): Promise<any> {
    const expiresIn = 60 * 60; // 1 hour (same as the JWT token expiration time)
    console.log('Invalidating token:', accessToken); // Add this line
    await this.redisClient.set(`invalidated_token:${accessToken}`, 'true', 'EX', expiresIn);
  }
  
  async isTokenInvalidated(accessToken: string | string[]): Promise<boolean> {
    console.log('Checking invalidated token:', accessToken);
    const isInvalidated = await this.redisClient.get(`invalidated_token:${accessToken}`);
    return !!isInvalidated;
  }

}