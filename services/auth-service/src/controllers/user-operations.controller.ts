import {service} from '@loopback/core';
import {del, param, patch, requestBody} from '@loopback/openapi-v3';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionsService, UserOperationsService} from '../services';

export class UserOperationsController {
  constructor(
    @service(UserOperationsService)
    private readonly userOps: UserOperationsService,
    @service(PermissionsService)
    private readonly permsService: PermissionsService,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @del('/user/{id}')
  async deleteUser(
    @param.path.string('id')
    id: string,
  ) {
    await this.userOps.deleteUser(id);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @patch('/permission/{id}')
  async addPermission(
    @param.path.string('id')
    userId: string,
    @requestBody()
    body: {permission: string; type: string},
  ) {
    if (body.type == 'add') {
      return await this.permsService.addAPermission(userId, body.permission);
    } else if (body.type == 'remove') {
      return await this.permsService.removeAPermission(userId, body.permission);
    }
  }
}
