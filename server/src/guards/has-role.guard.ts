import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleName } from '../entities/has-role.entity';

@Injectable()
export class HasRoleGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly roles: RoleName[]) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const requiredRole = this.roles.find(role => role === user.role.name);

    if (!requiredRole) {
      throw new UnauthorizedException('You do not have permission to access this resource');
    }

    return true;
  }
}
