import {Tenant, TenantConfig} from '@sourceloop/authentication-service';

const exclusionArray = [
  'deleted',
  'deletedBy',
  'deletedOn',
  'createdOn',
  'createdBy',
  'modifiedOn',
  'modifiedBy',
  'createdBy',
];

function genericExclusion<T>(): (keyof T)[] {
  return exclusionArray as unknown as (keyof T)[];
}

const tenantExclusion = genericExclusion<Tenant>();
const tenantConfigExclusion = genericExclusion<TenantConfig>();

export {tenantExclusion, tenantConfigExclusion};
