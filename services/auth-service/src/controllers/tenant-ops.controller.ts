import {getModelSchemaRef, post, requestBody} from '@loopback/openapi-v3';
import {repository} from '@loopback/repository';
import {Tenant, TenantConfig} from '@sourceloop/authentication-service';
import {CONTENT_TYPE} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {CustomTenantRepository} from '../repositories';

export class TenantOpsController {
  constructor(
    @repository(CustomTenantRepository)
    private readonly customTenantRepo: CustomTenantRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @post('/tenant')
  async createTenant(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Tenant, {
            exclude: [
              'deleted',
              'deletedBy',
              'deletedOn',
              'createdOn',
              'createdBy',
              'modifiedOn',
              'modifiedBy',
              'createdBy',
              'status',
            ],
          }),
        },
      },
    })
    model: Tenant,
  ): Promise<void> {
    return await this.customTenantRepo.createNewTenant(model);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @post('/tenant-config')
  async createTenantConfig(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(TenantConfig, {
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
    model: TenantConfig,
  ): Promise<void> {
    return await this.customTenantRepo.createNewTenantConfig(model);
  }
}
