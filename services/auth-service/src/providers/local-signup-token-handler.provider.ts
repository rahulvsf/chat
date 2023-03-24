import {Provider, ValueOrPromise} from '@loopback/context';
import {SignupTokenHandlerFn} from '@sourceloop/authentication-service';

export class LocalSignUpTokenHandlerProvider
  implements Provider<SignupTokenHandlerFn>
{
  constructor() {
    // Empty Constructor
  }

  value(): ValueOrPromise<SignupTokenHandlerFn> {
    return async dto => {
      console.log(dto);
    };
  }
}
