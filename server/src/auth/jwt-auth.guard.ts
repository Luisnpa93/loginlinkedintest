import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivateResult = super.canActivate(context);
    const result = canActivateResult instanceof Observable
      ? await canActivateResult.toPromise()
      : canActivateResult;
  
    if (result) {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
      const token = authHeader.split(' ')[1];
      const decodedToken = this.authService.jwtServiceInstance.decode(token);
      const email = typeof decodedToken === 'object' ? decodedToken.email : null;
  
      // Get the user from the email
      const user = await this.authService.getUserByEmail(email);
      request.user = user;
    }
  
    return result;
  }
  
}
