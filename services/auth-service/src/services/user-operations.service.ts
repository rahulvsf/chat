import {BindingScope, injectable} from '@loopback/core';
import {AnyObject, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  AuthClientRepository,
  User,
  UserCredentials,
  UserRepository,
  UserTenant,
  UserTenantRepository,
} from '@sourceloop/authentication-service';
import {AuthenticateErrorKeys, UserStatus} from '@sourceloop/core';
import bcrypt from 'bcrypt';
import {nanoid} from 'nanoid';
import {UserDto} from '../models';
const saltRounds = 10;

@injectable({scope: BindingScope.TRANSIENT})
export class UserOperationsService {
  constructor(
    @repository(UserTenantRepository)
    private readonly userTenantRepository: UserTenantRepository,
    @repository(UserRepository)
    private readonly userRepository: UserRepository,
    @repository(AuthClientRepository)
    private readonly authClientRepository: AuthClientRepository,
  ) {}

  async createUser(userDto: UserDto, options: AnyObject) {
    this.validateUserCreation(userDto, options);

    // check for auth client
    const authClient = await this.authClientRepository.findOne({
      where: {
        clientId: userDto.clientId,
      },
    });
    if (!authClient) {
      throw new HttpErrors.BadRequest('Invalid Client');
    }

    // check if user already exists
    const userExists = await this.userRepository.findOne({
      where: {or: [{username: userDto.username}, {email: userDto.email}]},
      fields: {id: true},
    });
    if (userExists) {
      // check if user tenat exists
      const userTenantExists = await this.userTenantRepository.findOne({
        where: {
          userId: userExists.id,
          tenantId: userDto.tenantId,
        },
      });
      if (userTenantExists) {
        throw new HttpErrors.BadRequest('User does not exist');
      } else {
        const userTenant = await this.createUserTenantData(
          userDto,
          UserStatus.ACTIVE,
          userExists?.id,
          options,
        );
        return new UserDto({
          roleId: userTenant.roleId,
          status: userTenant.status,
          tenantId: userTenant.tenantId,
          userTenantId: userTenant.id,
        });
      }
    }

    const username = userDto.username;
    userDto.username = username.toLowerCase();
    const userSaved = await this.userRepository.createWithoutPassword(
      new User({
        id: nanoid(),
        username: userDto.username,
        firstName: userDto.firstName,
        lastName: userDto.lastName,
        email: userDto.email,
        phone: userDto.phone,
        defaultTenantId: userDto.tenantId,
        authClientIds: `{${authClient.id}}`,
      }),
    );

    const userTenantData = await this.createUserTenantData(
      userDto,
      UserStatus.ACTIVE,
      userSaved.id,
      options,
    );

    await this.setPassword(userDto.email, userDto.password);

    return new UserDto({
      roleId: userTenantData.roleId,
      status: userTenantData.status,
      tenantId: userTenantData.tenantId,
      userTenantId: userTenantData.id,
    });
  }

  async deleteUser(userId: string) {
    const userFound = await this.userRepository.findById(userId);
    await this.userRepository.delete(userFound);
  }

  // do a series of checks
  validateUserCreation(userDto: UserDto, options?: AnyObject): void {
    // email check
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    if (userDto.email && !emailRegex.test(userDto.email)) {
      throw new HttpErrors.BadRequest('Email invalid');
    }

    // check for valid domains
    const allowedDomains = (process.env.AUTO_SIGNUP_DOMAINS ?? '').split(',');
    const emailDomain = userDto.email.split('@')[1];
    if (!(emailDomain && allowedDomains.length > 0)) {
      throw new HttpErrors.BadRequest(
        'Domain not supported, please enter a valid email',
      );
    }
    if (!allowedDomains.includes(emailDomain) && options) {
      options.authProvider = 'internal';
      return;
    }

    // phone number check
    const e16RegEx = /^\+?[1-9]\d{1,14}$/;
    if (userDto.phone && !e16RegEx.test(userDto.phone)) {
      throw new HttpErrors.BadRequest('Phone number invalid');
    }
  }

  async createUserTenantData(
    userDto: UserDto,
    userStatus: UserStatus,
    userId?: string,
    options?: AnyObject,
  ): Promise<UserTenant> {
    return this.userTenantRepository.create(
      {
        id: nanoid(),
        roleId: userDto.roleId,
        status: userStatus,
        tenantId: userDto.tenantId,
        userId,
      },
      options,
    );
  }

  async setPassword(email: string, newPassword: string): Promise<boolean> {
    const user = await this.userRepository.findOne({where: {email}});
    let creds;
    try {
      creds = user && (await this.userRepository.credentials(user.id).get());
    } catch (error) {
      // nothing to do
    }
    // user is deleted or does not exist
    if (!user || user.deleted) {
      throw new HttpErrors.Unauthorized(AuthenticateErrorKeys.UserDoesNotExist);
    } else if (creds) {
      throw new HttpErrors.Unauthorized('User already signed up');
    }
    // else set password
    const password = await bcrypt.hash(newPassword, saltRounds);
    creds = new UserCredentials({
      id: nanoid(),
      authProvider: 'internal',
      password,
      userId: user.id,
    });
    await this.userRepository.credentials(user.id).create(creds);
    return true;
  }
}
