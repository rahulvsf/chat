import {inject, Provider, ValueOrPromise} from '@loopback/context';
import {SignUpBindings, SignupTokenHandlerFn, UserSignupFn} from '@sourceloop/authentication-service';
import { UserDto } from '../models';

export class LocalSignUpTokenHandlerProvider
  implements Provider<SignupTokenHandlerFn>
{

    constructor(
        @inject.getter(SignUpBindings.LOCAL_SIGNUP_PROVIDER)
        private readonly signUpHandler: UserSignupFn<UserDto, UserDto>
    ){}

  value(): ValueOrPromise<SignupTokenHandlerFn> {
    return async dto => {
      console.log(dto);
    };
  }
}
