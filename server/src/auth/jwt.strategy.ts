import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService,
    private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      algorithms: ['HS256'], // add this line to specify the expected signing algorithm
    });
  }

  async validate(payload: any) {
    const reconstructedToken = { id: payload.id, email: payload.email, exp: payload.exp };
    if (reconstructedToken.id === undefined || reconstructedToken.email === undefined) {
      throw new UnauthorizedException('Invalid access token: missing user id or email');
    } else if (reconstructedToken.exp < Date.now() / 1000) {
      console.log('Token has expired!');
      throw new UnauthorizedException('Session has expired');
    } else {
      const user = await this.authService.getUserById(payload.sub);
      
      return {
        id: user.id,
        linkedinId: user.linkedinId,
        displayName: user.displayName,
        email: user.email,
        linkedinEmail: user.linkedinEmail,
        photo: user.photo,
        // add this line to include the access token
      };
    }
  }
  
}
  

