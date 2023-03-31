
import { BadRequestException, Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import {JwtAuthGuard} from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './create-user.dto';
import { SignUpDto } from './SignUpDto';
import { User } from 'src/user/user.entity';
import { LoginDto } from './LoginDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly jwtService: JwtService) {}


  /* @Post('/signup')
async signUp(@Body() signUpDto: SignUpDto): Promise<User> {
  const user = await this.authService.mergeOrCreateUser(signUpDto);
  if (!user.emailVerified) {
    throw new BadRequestException('Email not verified');
  }
  return user;
}*/

@Post('/signup')
async signUp(@Body() signUpDto: SignUpDto): Promise<void> {
  return await this.authService.VerifyEmail(signUpDto);
 
}

@Get('/verify')
async verifyEmail(@Query('token') verificationToken: string, @Res() res: Response): Promise<void> {
    await this.authService.verifyVerificationToken(verificationToken);
  /*const user = await this.authService.getUserById(decodedToken.sub);
  if (user && !user.emailVerified) {
    user.emailVerified = true;
    await this.authService.saveUser(user);
  }*/
  // Redirect the user to a page with a message saying that their email has been verified
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
    // Placeholder
  }

  @Get('/linkedin/callback')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinLoginCallback(@Req() req, @Res() res: Response) {
    try {
      console.log('linkedinLoginCallback called with req.user:', req.user); // Add this line
  
      
      const existentUser = await this.authService.getUserByLinkedinId(req.user.linkedinId);
      
      if (existentUser) {
        const { user, accessToken } = await this.authService.createLinkedInUser(existentUser);
        console.log('validateUser returned user and accessToken:', user, accessToken); // Add this line
  
        const callbackUrl = `https://localhost:3002/login/callback`;
        const redirectUrl = `${callbackUrl}?user=${encodeURIComponent(JSON.stringify(user))}&accessToken=${accessToken}`;
        return res.redirect(redirectUrl);
      }  else {
        // user not found in database, handle error or redirect as needed
        const { user, accessToken } = await this.authService.CreateOrMergeLinkedIn(req.user);
        console.log('validateUser returned user and accessToken:', user, accessToken);

        const callbackUrl = `https://localhost:3002/login/callback`;
        const redirectUrl = `${callbackUrl}?user=${encodeURIComponent(JSON.stringify(user))}&accessToken=${accessToken}`;
        return res.redirect(redirectUrl);
      }
      
    } catch (error) {
      console.error('Error in linkedinLoginCallback:', error);
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

@UseGuards(JwtAuthGuard) // This ensures only authenticated users can access this endpoint
@Post('logout')
async logout(@Req() req: Request): Promise<any> {
  const user = req.user;
  console.log(req.headers)
  const accessToken = req.headers["authorization"].split(" ")[1]
  console.log('Invalidating token:', accessToken);
  await this.authService.isTokenInvalidated(accessToken);
  return { message: 'Logged out successfully' };
}



}


