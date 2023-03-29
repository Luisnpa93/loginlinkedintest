
import { Controller, Get, Req, Res, UseGuards, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import {JwtAuthGuard} from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly jwtService: JwtService) {}

    @Post('/signup')
    async signUp(@Body() createUserDto: CreateUserDto): Promise<any> {
      return this.authService.createUser(createUserDto);
    }

    @UseGuards(AuthGuard('local'))
@Post('/login')
async login(@Req() req) {
  return this.authService.login(req.user);
}

  @Get('/linkedin')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinLogin() {
    // Placeholder
  }

  @Get('/linkedin/callback')
@UseGuards(AuthGuard('linkedin'))
async linkedinLoginCallback(@Req() req, @Res() res: Response) {
  try {
    console.log('linkedinLoginCallback called with req.user:', req.user);

    if (!req.user) {
      // Handle the case when the user is not logged in
      // You can return an error message or redirect the user to the login page
      return res.status(401).json({ message: 'User not logged in' });
    }

    const { user, accessToken } = await this.authService.linkUserWithLinkedin(req.user, req.user.id);
    console.log('validateUser returned user and accessToken:', user, accessToken);

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
async getUser(@Req() req: Request): Promise<{ id: number; linkedinId: string; displayName: string; email: string; photo: string }> {
  console.log('Request headers:', req.headers);
  console.log('Decoded token:', req.user);

  if (req.user) {
    const id = req.user['id'];
    const linkedinId = req.user['linkedinId'];
    const displayName = req.user['displayName'];
    const email = req.user['email'];
    const photo = req.user['photo']; // Extract the photo URL from the decoded token
    console.log('User data:', { id, linkedinId, displayName, email, photo });

    return {
      id: id,
      linkedinId: linkedinId,
      displayName: displayName,
      email: email,
      photo: photo, // Return the photo URL
    };
  } else {
    throw new Error('Access token not found or invalid');
  }
}


@Post('/logout')
@UseGuards(JwtAuthGuard)
async logout(@Req() req) {
  return this.authService.logout(req.user);
}


}