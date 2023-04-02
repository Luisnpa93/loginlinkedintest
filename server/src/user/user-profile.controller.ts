import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Controller('user')
    export class UserProfileController {
        constructor(private readonly userProfileService: UserProfileService,
          @InjectRepository(User)
          private userRepository: Repository<User>,
          ) {}

    @Post('/profile')
    @UseGuards(JwtAuthGuard)
        async createProfile(@Body() data: { nickname: string; occupation: string }, @Req() req: Request) {
        const userId = req.user['id'];
        return await this.userProfileService.createProfile(data, userId);
        }

    @Get('/entity')
    @UseGuards(JwtAuthGuard)
        async getUser(@Req() req: Request): Promise<{ id: number; linkedinId: string; displayName: string; email: string; linkedinEmail: string; photo: string }> {
          if (req.user) {
            const id = req.user['id'];
            const linkedinId = req.user['linkedinId'];
            const displayName = req.user['displayName'];
            const email = req.user['email'];
            const linkedinEmail = req.user['linkedinEmail'];
            const photo = req.user['photo']; 
            return {
              id: id,
              linkedinId: linkedinId,
              displayName: displayName,
              email: email,
              linkedinEmail: linkedinEmail,
              photo: photo,
            };
          } else {
            throw new Error('Access token not found or invalid');
          }
        }

       
    
}