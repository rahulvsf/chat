import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  UserLevelPermissionRepository,
  UserTenantRepository,
} from '@sourceloop/authentication-service';
import {nanoid} from 'nanoid';
import {Permissions} from '../enums';

@injectable({scope: BindingScope.TRANSIENT})
export class PermissionsService {
  constructor(
    @repository(UserLevelPermissionRepository)
    private readonly repo: UserLevelPermissionRepository,
    @repository(UserTenantRepository)
    private readonly userTenantRepo: UserTenantRepository

  ) {}

  async addAPermission(userId: string, permission: string) {
    this.checkPermissionString(permission);
    const userTenant = await this.getUserDetails(userId);
    // check if the permission already exists
    const currentPermissions = await this.repo.find({
      where: {userTenantId: userTenant.id, permission},
    });
    if (currentPermissions.length > 0) {
      currentPermissions[0].allowed = true;
      await this.repo.update(currentPermissions[0]);
    } else {
      await this.repo.create({
        id: nanoid(),
        userTenantId: userTenant.id,
        permission,
        allowed: true,
      });
    }
  }

  async removeAPermission(userId: string, permission: string) {
    this.checkPermissionString(permission);
    const userTenant = await this.getUserDetails(userId);
    const currentPermissions = await this.repo.find({
      where: {userTenantId: userTenant.id, permission},
    });

    if (currentPermissions.length > 0) {
      currentPermissions[0].allowed = false;
      await this.repo.update(currentPermissions[0]);
    } else {
      throw HttpErrors.NotFound('Permission does not exist');
    }
  }

  checkPermissionString(permission: string) {
    if (!Object.values<string>(Permissions).includes(permission)) {
      throw HttpErrors.BadRequest('Invalid Permission String');
    }
  }

  async getUserDetails(userId: string){
    const user = await this.userTenantRepo.find({
      where: {userId: userId}
    })
    if(user.length>0){
      return user[0];
    } else {
      throw HttpErrors.NotFound('Invalid User Id');
    }

  }
}
