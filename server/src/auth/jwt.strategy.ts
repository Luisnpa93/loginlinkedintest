import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    });
  }

  //async validate(payload: any) {
    //console.log('JWT payload', payload)
    //return { id: payload.id, linkedinId: payload.linkedinId, displayName: payload.displayName, email: payload.email, photo: payload.photo };
  //}
  async validate(payload: any) {
    const isInvalidated = await this.authService.isTokenInvalidated(payload.accessToken);
    if (isInvalidated) {
      throw new UnauthorizedException();
    }
    // Get the user from the email
  const email = payload.email;
  const user = await this.authService.getUserByEmail(email);
  console.log('User in JwtStrategy:', user); // Add this line


  return user;
}
}

