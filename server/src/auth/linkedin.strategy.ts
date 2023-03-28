import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-linkedin-oauth2';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor(private readonly configService: ConfigService,
    private readonly authService: AuthService,) {
    super({
      clientID: configService.get<string>('LINKEDIN_CLIENT_ID'),
      clientSecret: configService.get<string>('LINKEDIN_CLIENT_SECRET'),
      callbackURL: configService.get<string>('LINKEDIN_CALLBACK_URL'),
      scope: ['r_emailaddress', 'r_liteprofile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user: any) => void,
  ): Promise<any> {
    console.log('LinkedInStrategy validate called with accessToken, refreshToken, profile:', accessToken, refreshToken, profile);
  
    try {
      const linkedinId = profile.id; // Update this line to extract the id property
      const displayName = profile.displayName;
      const email = profile.emails[0].value;
  
      const user = {
        linkedinId,
        displayName,
        email,
      };
      done(null, user);
    } catch (error) {
      console.error('Error in LinkedInStrategy validate:', error);
      done(error, null);
    }
  }
}