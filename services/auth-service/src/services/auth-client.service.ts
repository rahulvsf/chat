import {BindingScope, injectable} from '@loopback/core';
import {AnyObject, repository} from '@loopback/repository';
import {
  AuthClient,
  AuthClientRepository,
} from '@sourceloop/authentication-service';

@injectable({scope: BindingScope.TRANSIENT})
export class AuthClientService {
  constructor(
    @repository(AuthClientRepository)
    private readonly authClientRepo: AuthClientRepository,
  ) {}

  async create(authClient: AuthClient, options?: AnyObject) {
    const authClientSaved = await this.authClientRepo.create(
      authClient,
      options,
    );
    return new AuthClient({
      createdOn: authClientSaved.createdOn,
    });
  }
}
