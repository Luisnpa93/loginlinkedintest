import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { RoleName } from "../entities/has-role.entity";

@Injectable()
export class HasRoleGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRole = this.reflector.get<RoleName>('role', context.getHandler());

    if (!requiredRole) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      throw new UnauthorizedException();
    }

    if (user.role.name !== 'admin') {
      throw new UnauthorizedException();
    }

    const hasRole = user.role.name === requiredRole;

    return hasRole;
  }
}
