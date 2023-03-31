import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {AuthServiceDataSource} from '../datasources';
import { TokenLogin, TokenSuccess, UserLogin, UserLoginSuccess } from '../types';

export interface AuthAccessor {
  loginUser(data: UserLogin): Promise<UserLoginSuccess>;
  getTokens(data: TokenLogin): Promise<TokenSuccess>;
}

export class AuthAccessorProvider implements Provider<AuthAccessor> {
  constructor(
    @inject('datasources.AuthService')
    protected dataSource: AuthServiceDataSource = new AuthServiceDataSource(),
  ) {}

  value(): Promise<AuthAccessor> {
    return getService(this.dataSource);
  }
}
