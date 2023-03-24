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
    return async function googleSignup(profile) {
      console.log(profile);
      return null;
    };
  }
}
