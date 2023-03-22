import {service} from '@loopback/core';
import {getModelSchemaRef, post, requestBody} from '@loopback/openapi-v3';
import {AuthClient} from '@sourceloop/authentication-service';
import {CONTENT_TYPE} from '@sourceloop/core';
import {authorize} from 'loopback4-authorization';
import {AuthClientService} from '../services';

export class AuthClientController {
  constructor(
    @service(AuthClientService)
    private readonly authClientService: AuthClientService,
  ) {}

  @authorize({permissions: ['*']})
  @post('/auth-client')
  async createAuthClient(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(AuthClient, {
            exclude: [
              'deleted',
              'deletedBy',
              'deletedOn',
              'createdOn',
              'createdBy',
              'modifiedOn',
              'modifiedBy',
              'createdBy',
            ],
          }),
        },
      },
    })
    model: AuthClient,
  ): Promise<AuthClient> {
    return await this.authClientService.create(model);
  }
}
