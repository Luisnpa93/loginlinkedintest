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
      //profileFields: ['id', 'first-name', 'last-name', 'email-address', 'picture-url'],
      passReqToCallback: true,
    },
    async (
      req: any,
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: (error: any, user: any) => void,
    ) => {
      await this.validate(req, accessToken, refreshToken, profile, done);
    },
  );
}

async validate(
  req: any,
  accessToken: string,
  refreshToken: string,
  profile: any,
  done: (error: any, user: any, info?: any) => void,
): Promise<any> {
  console.log(
    'LinkedInStrategy validate called with accessToken, refreshToken, profile:',
    accessToken,
    refreshToken,
    profile,
  );

  try {
    const linkedinId = profile.id;
    const displayName = profile.displayName;
    const linkedinEmail = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
    const photo = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

    const linkedinProfile = {
      linkedinId,
      displayName,
      linkedinEmail,
      photo,
    };

    const existingUser = await this.authService.getUserByEmail(linkedinEmail);
    console.log('existingUser:', existingUser);

    if (existingUser) {
      if (existingUser.linkedinId) {
        // If the user is not logged in and their LinkedIn account is linked, log them in
        done(null, existingUser);
      } else {
        // If the user exists but their LinkedIn account is not linked, inform them to link their account first
        done(null, false, {
          redirectTo: '/mainlogin',
          message:
            'You need to log in and link your LinkedIn account before being able to log in using LinkedIn in the future',
        });
      }
    } else {
      // If the user doesn't exist, redirect them to the main login page to create an account first
      const homeUrl = `https://localhost:3002/mainlogin?message=${encodeURIComponent(
        'Please create an account and link your LinkedIn account before being able to log in using LinkedIn',
      )}`;
      return done(null, false, { redirectTo: homeUrl });
    }
  } catch (error) {
    console.error('Error in LinkedInStrategy validate:', error);
    done(error, false);
  }
}


}