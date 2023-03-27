import {Provider, ValueOrPromise} from '@loopback/context';
import {repository} from '@loopback/repository';
import {
  GoogleSignUpFn,
  UserRepository,
} from '@sourceloop/authentication-service';

export class GoogleSignUpProvider implements Provider<GoogleSignUpFn> {
  constructor(
    @repository(UserRepository)
    private readonly userRepo: UserRepository,
  ) {}

  value(): ValueOrPromise<GoogleSignUpFn> {
    // google sign up provider
    return async function googleSignup(profile) {
      console.log(profile);
      // TODO: create a new user and add 'Google'
      // as a provider
      return null;
    };
  }
}
