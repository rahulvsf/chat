import {Provider, service} from '@loopback/core';
import {UserSignupFn} from '@sourceloop/authentication-service';
import {UserDto} from '../models';
import {UserOperationsService} from '../services';

export class LocalSignUpProvider
  implements Provider<UserSignupFn<UserDto, UserDto>>
{
  constructor(
    @service(UserOperationsService)
    private readonly userOperations: UserOperationsService,
  ) {}

  // Local Sign Up
  value(): UserSignupFn<UserDto, UserDto> {
    // creating a new user wth userOperations service
    return async model => this.userOperations.createUser(model, {});
  }
}
