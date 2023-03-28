
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import * as cookie from 'cookie';
import { User } from '../user/user.entity';
import { LinkedInStrategy } from './linkedin.strategy';
import {JwtAuthGuard} from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly jwtService: JwtService) {}

  @Get('/linkedin')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinLogin() {
    // Placeholder
  }

  @Get('/linkedin/callback')
@UseGuards(AuthGuard('linkedin'))
async linkedinLoginCallback(@Req() req, @Res() res: Response) {
  try {
    console.log('linkedinLoginCallback called with req.user:', req.user); // Add this line
    const { user, accessToken } = await this.authService.validateUser(req.user);
    console.log('validateUser returned user and accessToken:', user, accessToken); // Add this line

    const callbackUrl = `https://localhost:3002/login/callback`;
    const redirectUrl = `${callbackUrl}?user=${encodeURIComponent(JSON.stringify(user))}&accessToken=${accessToken}`;
    return res.redirect(redirectUrl);
  } catch (error) {
    console.error('Error in linkedinLoginCallback:', error);
    res.status(500).send('Internal Server Error');
  }
}


  @Get('/user')
@UseGuards(JwtAuthGuard)
async getUser(@Req() req: Request): Promise<{ id: number; linkedinId: string; displayName: string; email: string }> {
  console.log('Request headers:', req.headers);
  console.log('Decoded token:', req.user);

  if (req.user) {
    const id = req.user['id'];
    const linkedinId = req.user['linkedinId'];
    const displayName = req.user['displayName'];
    const email = req.user['email'];
    console.log('User data:', { id, linkedinId, displayName, email }); // Add this line

    return {
      id: id,
      linkedinId: linkedinId,
      displayName: displayName,
      email: email,
    };
  } else {
    throw new Error('Access token not found or invalid');
  }
}
}