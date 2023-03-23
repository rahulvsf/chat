import {service} from '@loopback/core';
import {del, param} from '@loopback/openapi-v3';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {UserOperationsService} from '../services';

export class UserOperationsController {
  constructor(
    @service(UserOperationsService)
    private readonly userOps: UserOperationsService,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @del('/user/{id}')
  async deleteUser(
    @param.path.number('id')
    id: string,
  ) {
    await this.userOps.deleteUser(id);
  }
}
