import { Controller, Get, Req, Res, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get('linkedin')
  @UseGuards(AuthGuard('linkedin'))
  async login() {
    // This method will be handled by the LinkedIn strategy
  }

  @Get('linkedin/callback')
  @UseGuards(AuthGuard('linkedin'))
  async loginCallback(@Req() req, @Res() res) {
    // You can use the req.user object, which contains the user information returned by the LinkedIn strategy
    // Redirect to your React app, passing along the user information or a token as needed
    res.redirect(`https://localhost:3000/?user=${JSON.stringify(req.user)}`);
  }

  @Get('welcome')
  async welcome(@Query('displayName') displayName: string, @Res() res) {
    const welcomeMessage = `Welcome, ${displayName}!`;
    res.send(welcomeMessage);
  }
}

