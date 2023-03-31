import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('user-profile')
    export class UserProfileController {
        constructor(private readonly userProfileService: UserProfileService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
        async createProfile(@Body() data: { nickname: string; occupation: string }, @Req() req: Request) {
        const userId = req.user['id'];
        return await this.userProfileService.createProfile(data, userId);
        }
}