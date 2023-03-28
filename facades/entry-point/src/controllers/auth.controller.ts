// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {post, requestBody} from '@loopback/openapi-v3';
import { authorize } from 'loopback4-authorization';
import {AuthAccessor} from '../services';
import {UserLogin, UserLoginSuccess} from '../types';

export class AuthController {
  constructor(
    @inject('services.AuthAccessor')
    private readonly authService: AuthAccessor,
  ) {}

  @authorize({permissions: ["*"]})
  @post('/login')
  async loginUser(
    @requestBody()
    model: UserLogin,
  ): Promise<UserLoginSuccess> {
    return await this.authService.loginUser(model);
  }
}
