import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';

interface JwtPayload {
  id: number;
  [key: string]: any;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  private extractToken(req: Request): string | undefined {
    const authHeader = req.headers.authorization;
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext<{ req: Request & { user_data?: any } }>();
    const token = this.extractToken(req);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });

      const user = await this.userService.findOne(payload.id);
      req.user_data = user;
      return true;
    } catch (error) {
      console.log('err=> ', error);
      throw new HttpException('Invalid token!', HttpStatus.UNAUTHORIZED);
    }
  }
}
