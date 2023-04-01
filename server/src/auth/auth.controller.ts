import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import {JwtAuthGuard} from '../guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from '../dto/SignUpDto';
import { LoginDto } from '../dto/LoginDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly jwtService: JwtService) {}

@Post('/signup')
async signUp(@Body() signUpDto: SignUpDto): Promise<void> {
  return await this.authService.VerifyEmail(signUpDto);
}

@Get('/verify')
async verifyEmail(@Query('token') verificationToken: string, @Res() res: Response): Promise<void> {
  await this.authService.verifyVerificationToken(verificationToken);
  res.redirect('https://localhost:3002/verification-successful');
}

@UseGuards(AuthGuard('local'))
@Post('/login')
async login(@Body() loginDto: LoginDto) {
  return this.authService.login(loginDto.email, loginDto.password);
}

@Get('/linkedin')
@UseGuards(AuthGuard('linkedin'))
  async linkedinLogin() {
}

@Get('/linkedin/callback')
@UseGuards(AuthGuard('linkedin'))
async linkedinLoginCallback(@Req() req, @Res() res: Response) {
  try {
    const existentUser = await this.authService.getUserByLinkedinId(req.user.linkedinId);
    if (existentUser) {
        const {user, accessToken} = await this.authService.getUserAndToken(existentUser);
        const callbackUrl = `https://localhost:3002/login/callback`;
        const redirectUrl = `${callbackUrl}?user=${encodeURIComponent(JSON.stringify(user))}&accessToken=${accessToken}`;;
        return res.redirect(redirectUrl);
    }  else {
        const {user, accessToken} = await this.authService.createOrMergeLinkedIn(req.user);
        const callbackUrl = `https://localhost:3002/login/callback`;
        const redirectUrl = `${callbackUrl}?user=${encodeURIComponent(JSON.stringify(user))}&accessToken=${accessToken}`;;
        return res.redirect(redirectUrl);
    } 
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  }
  
@UseGuards(JwtAuthGuard) 
@Post('logout')
async logout(@Req() req: Request): Promise<any> {
  const user = req.user;
  const accessToken = req.headers["authorization"].split(" ")[1]
  await this.authService.isTokenInvalidated(accessToken);
  return { message: 'Logged out successfully' };
}
}


