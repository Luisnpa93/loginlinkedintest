
import { Controller, Get, Req, Res, UseGuards, Post, Body, UnauthorizedException, NotFoundException, BadRequestException, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import {JwtAuthGuard} from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './create-user.dto';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>, // Add this line
 ) {}

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
  
      if (req.user) {
        // If the user exists and has already linked their LinkedIn account, log them in
        const result = await this.authService.login(req.user);
  
        console.log('validateUser returned result:', result);
  
        if (!result || !result.user || !result.accessToken) {
          // Handle the case when the user or accessToken is not defined
          return res.status(500).json({ message: 'Failed to log in with LinkedIn' });
        }
  
        const { user, accessToken } = result;
  
        const callbackUrl = `https://localhost:3002/login/callback`;
        const redirectUrl = `${callbackUrl}?user=${encodeURIComponent(JSON.stringify(user))}&accessToken=${accessToken}`;
        return res.redirect(redirectUrl);
      } else if (req.authInfo && req.authInfo.redirectTo && req.authInfo.message) {
        // If the user has not linked their LinkedIn account or doesn't exist, show an error message or redirect them to the main login page
        const redirectTo = req.authInfo.redirectTo;
        const errorMessage = req.authInfo.message;
        const homeUrl = `https://localhost:3002${redirectTo}?message=${encodeURIComponent(errorMessage)}`;
        return res.redirect(homeUrl);
      } else {
        // If there is an unknown error, handle it
        console.error('Error in linkedinLoginCallback:', Error('No user data received from LinkedIn'));
  res.status(500).send('Internal Server Error');
      }
    } catch (error) {
      console.error('Error in linkedinLoginCallback:', error);
      res.status(500).send('Internal Server Error');
    }
  }



  @Get('linkedin/check')
async linkedinCheck(@Query('linkedinEmail') linkedinEmail: string): Promise<{ linked: boolean }> {
  if (!linkedinEmail) {
    throw new BadRequestException('LinkedIn email is required');
  }

  const user = await this.usersRepository.findOne({ where: { linkedinEmail } });

  return { linked: !!user }; // Return true if a user with the given LinkedIn email exists, false otherwise
}



@Get('linkedin/link')
@UseGuards(AuthGuard('linkedin'))
async linkedinLink(@Req() req, @Res() res: Response) {
  try {
    console.log('linkedinLink called with req.user:', req.user);

    if (!req.user) {
      // Handle the case when the user is not logged in
      // You can return an error message or redirect the user to the login page
      return res.status(401).json({ message: 'User not logged in' });
    }

    // Get the currently logged-in user from your authentication system
    const loggedInUser = req.user;

    if (!loggedInUser) {
      // Handle the case when the loggedInUser is not found
      return res.status(404).json({ message: 'Logged-in user not found' });
    }

    // Update the loggedInUser with the LinkedIn data from req.user
    loggedInUser.linkedinId = req.user.linkedinId;
    loggedInUser.linkedinEmail = req.user.linkedinEmail;
    // ... (update any other LinkedIn data you want to store)

    // Save the updated loggedInUser to the database
    await this.usersRepository.save(loggedInUser);

    // Redirect the user back to the profile page or another page in your application
    const redirectUrl = `https://localhost:3002/profile`;
    return res.redirect(redirectUrl);
  } catch (error) {
    console.error('Error in linkedinLink:', error);
    res.status(500).send('Internal Server Error');
  }
}

@Get('/user')
@UseGuards(JwtAuthGuard)
async getUser(@Req() req: Request): Promise<{ id: number; linkedinId: string; displayName: string; email: string; linkedinEmail: string; photo: string }> {
  console.log('Request headers:', req.headers);
  console.log('Decoded token:', req.user);

  if (req.user) {
    const id = req.user['id'];
    const linkedinId = req.user['linkedinId'];
    const displayName = req.user['displayName'];
    const email = req.user['email'];
    const linkedinEmail = req.user['linkedinEmail'];
    const photo = req.user['photo']; // Extract the photo URL from the decoded token
    console.log('User data:', { id, linkedinId, displayName, email, photo });

    return {
      id: id,
      linkedinId: linkedinId,
      displayName: displayName,
      email: email,
      linkedinEmail: linkedinEmail,
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