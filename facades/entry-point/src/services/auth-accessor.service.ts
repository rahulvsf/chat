import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {AuthServiceDataSource} from '../datasources';
import { UserLogin, UserLoginSuccess } from '../types';

export interface AuthAccessor {
  loginUser(data: UserLogin): Promise<UserLoginSuccess>;
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
