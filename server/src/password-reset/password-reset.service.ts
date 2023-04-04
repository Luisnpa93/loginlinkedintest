import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Redis } from 'ioredis';
import { EmailService } from 'src/emailservice/email.service';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class PasswordResetService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly emailService: EmailService,
    @InjectRedis() private readonly redisClient: Redis,
  ) {}

  async generatePasswordResetToken(email: string): Promise<string> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const resetToken = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
    await this.redisClient.set(`passwordResetToken:${resetToken}`, user.id, 'EX', 60 * 60 * 24);
    const resetLink = `https://localhost:3002/password-reset?token=${resetToken}`;
    await this.emailService.sendPasswordResetEmail(email, resetLink);
    return resetToken;
  }

  async verifyPasswordResetToken(token: string): Promise<number> {
    const userIdString = await this.redisClient.get(`passwordResetToken:${token}`);
    if (!userIdString) {
      throw new BadRequestException('Invalid or expired password reset token');
    }
    const userId = parseInt(userIdString, 10);
    return userId;
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const userId = await this.verifyPasswordResetToken(token);
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.password = await bcrypt.hash(password, 10);
    await this.usersRepository.save(user);
    await this.redisClient.del(`passwordResetToken:${token}`);
  }
}
