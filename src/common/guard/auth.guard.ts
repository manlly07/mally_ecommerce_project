
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
import { KeysService } from 'src/components/keys/keys.service';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor( 
        private jwtService: JwtService,
        private keyService: KeysService
    ) {}
  
    async canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      const user_login_ip = request.ip;
      const user_agent = request.get('User-Agent');

      request.body = { ...request.body, user_login_ip, user_agent };
      
      if (!token) {
        throw new UnauthorizedException('Access token is missing');
      }

      try {
        const keyStore = await this.keyService.findUserToken({
            user_id: request.body.user_id,
            user_agent: user_agent,
            user_login_ip: user_login_ip,
        });
        console.log(keyStore)

        if(!keyStore) throw new UnauthorizedException();

        const payload = await this.jwtService.verifyAsync(
          token,
          {
            secret: keyStore.user_public_key,
          }
        );

        if(keyStore.user_id !== payload.user_id) throw new UnauthorizedException();
        request['user'] = payload;

      } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new UnauthorizedException('Access token expired');
        } else {
            throw new UnauthorizedException('Invalid access token');
        }
      }
      return true;
    }
  
    private extractTokenFromHeader(request: Request) {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }
  