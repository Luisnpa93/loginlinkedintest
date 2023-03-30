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
      algorithms: ['HS256'], // add this line to specify the expected signing algorithm
    });
  }

  async validate(payload: any) {
    if (!payload.id) {
      throw new UnauthorizedException('Invalid access token: missing user id');
    }
  
    console.log('JWT payload', payload);
  
    return { 
      id: payload.id, 
      linkedinId: payload.linkedinId, 
      displayName: payload.displayName, 
      email: payload.email, 
      photo: payload.photo 
    };
  }
  
}
