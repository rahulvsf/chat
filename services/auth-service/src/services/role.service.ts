import {injectable, BindingScope} from '@loopback/core';
import {AnyObject, repository} from '@loopback/repository';
import {Role, RoleRepository} from '@sourceloop/authentication-service';
import { nanoid } from 'nanoid';

@injectable({scope: BindingScope.TRANSIENT})
export class RoleService {
  constructor(
    @repository(RoleRepository)
    private readonly roleRepo: RoleRepository,
  ) {}

  async createRole(role: Role, options?: AnyObject) {
    role.id = nanoid();
    const roleSaved = await this.roleRepo.create(role, options);
    return new Role({createdOn: roleSaved.createdOn, name: roleSaved.name});
  }
}
