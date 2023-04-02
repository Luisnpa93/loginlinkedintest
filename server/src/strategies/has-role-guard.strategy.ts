import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class HasRoleGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRole = this.reflector.get<string>('role', context.getHandler());

    if (!requiredRole) {
      return true;
    }

    const user = context.switchToHttp().getRequest().user;
    const role = user.role.map((role) => role.name);

    return role.includes(requiredRole);
  }
}
