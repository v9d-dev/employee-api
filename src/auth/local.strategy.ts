import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private moduleRef: ModuleRef
    ) {
    super( {passReqToCallback: true});
  }

  async validate(request: Request, username: string, password: string) {
    const user = await this.authService.validateUser(request, username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
