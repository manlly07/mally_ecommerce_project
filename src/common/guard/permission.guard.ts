import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/components/users/users.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user_id = request.body.user_id; 

    
    const hasPermissions = this.usersService.userHasPermission(user_id, requiredPermissions)

    // const userHasAllPermissions = hasPermissions.every((hasPermission) => hasPermission === true);

    if (!hasPermissions) {
      throw new ForbiddenException('Bạn không có quyền truy cập vào tài nguyên này.');
    }

    return hasPermissions;
  }
}
