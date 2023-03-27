
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
    const { user, accessToken } = await this.authService.validateUser(req.user);
    const callbackUrl = `https://localhost:3002/login/callback`;
    const redirectUrl = `${callbackUrl}?user=${encodeURIComponent(JSON.stringify(user))}&accessToken=${accessToken}`;
    //const redirectUrl = `${callbackUrl}?accessToken=${accessToken}`;
    //res.setHeader('Set-Cookie', cookie.serialize('user', JSON.stringify(user), { sameSite: 'None', secure: true }));
    //res.setHeader('Set-Cookie', cookie.serialize('accessToken', accessToken, { sameSite: 'None', secure: true }));
    return res.redirect(redirectUrl);
  }


  @Get('/user')
@UseGuards(JwtAuthGuard)
async getUser(@Req() req: Request): Promise<{ linkedinId: string; displayName: string; email: string }> {
  console.log('Request headers:', req.headers);
  console.log('Decoded token:', req.user);

  if (req.user) {
    const linkedinId = req.user['id'];
    const displayName = req.user['displayName'];
    const email = req.user['email'];
    console.log('User data:', { linkedinId, displayName, email }); // Add this line

    return {
      linkedinId: linkedinId,
      displayName: displayName,
      email: email,
    };
  } else {
    throw new Error('Access token not found or invalid');
  }
}
}