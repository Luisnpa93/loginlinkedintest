
import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
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

    @Post('/logout')
@UseGuards(JwtAuthGuard)
async logout(@Req() req) {
  return this.authService.logout(req.user);
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
      console.log('linkedinLoginCallback called with req.user:', req.user); // Add this line
  
      
      const existentUser = await this.authService.getUserByLinkedinId(req.user.linkedinId);
      
      if (existentUser) {
        const { user, accessToken } = await this.authService.updateUser(existentUser);
        console.log('validateUser returned user and accessToken:', user, accessToken); // Add this line
  
        const callbackUrl = `https://localhost:3002/login/callback`;
        const redirectUrl = `${callbackUrl}?user=${encodeURIComponent(JSON.stringify(user))}&accessToken=${accessToken}`;
        return res.redirect(redirectUrl);
      }  else {
        // user not found in database, handle error or redirect as needed
        const { linkedinId, displayName, email, photo } = req.user;
        const newUser = {
          linkedinId,
          displayName,
          email,
          photo,
          // Add any other properties as needed
        };
        const createdUser = await this.authService.updateUser(newUser);
        console.log('New user created:', createdUser); // Add this line to log the created user
      }
      
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
}