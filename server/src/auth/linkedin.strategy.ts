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
      profileFields: ['id', 'first-name', 'last-name', 'email-address', 'picture-url']
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
      const linkedinId = profile.id;
      const displayName = profile.displayName;
      const email = profile.emails[0].value;
      console.log('profile.photos:', profile.photos);
      const photo = profile.photos && profile.photos[0] ? profile.photos[0].value : null; // or const photo = profile.pictureUrl;

  
      const user = {
        linkedinId,
        displayName,
        email,
        photo, // Add the photo URL to the user object
      };
      done(null, user);
    } catch (error) {
      console.error('Error in LinkedInStrategy validate:', error);
      done(error, null);
    }
  }
}