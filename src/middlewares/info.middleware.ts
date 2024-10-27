import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestInfoMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req['user_ip'] = req.ip;
    req['user_agent'] = req.get('User-Agent') || '';
    console.log('Request IP:', req['user_ip']);
    console.log('Request User-Agent:', req['user_agent']);
    next();
  }
}
