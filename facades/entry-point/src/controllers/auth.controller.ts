import {inject} from '@loopback/core';
import {post, requestBody} from '@loopback/openapi-v3';
import {authorize} from 'loopback4-authorization';
import {AuthAccessor} from '../services';
import {TokenSuccess, UserLogin, UserLoginSuccess} from '../types';

export class AuthController {
  constructor(
    @inject('services.AuthAccessor')
    private readonly authService: AuthAccessor,
  ) {}

  @authorize({permissions: ['*']})
  @post('/login')
  async loginUser(
    @requestBody()
    model: UserLogin,
  ): Promise<TokenSuccess> {
    const result: UserLoginSuccess = await this.authService.loginUser(model);
    return await this.authService.getTokens({
      code: result.code,
      clientId: model.client_id,
    });
  }
}
