import {service} from '@loopback/core';
import {getModelSchemaRef, post, requestBody} from '@loopback/openapi-v3';
import {Role} from '@sourceloop/authentication-service';
import {CONTENT_TYPE} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {genericExclusions} from '../helpers';
import {RoleService} from '../services';

export class RoleController {
  constructor(
    @service(RoleService)
    private readonly roleService: RoleService,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @post('/role')
  async createANewRole(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Role, {
            exclude: genericExclusions<Role>(['id']),
          }),
        },
      },
    })
    model: Role,
  ): Promise<Role> {
    return await this.roleService.createRole(model, {});
  }
}
