import {inject} from '@loopback/context';
import {del, get, param, post, requestBody} from '@loopback/openapi-v3';
import {HttpErrors} from '@loopback/rest';
import {OPERATION_SECURITY_SPEC} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {Permissions} from '../enums';
import {MessageAccessor} from '../services';
import {PostMessage} from '../types';

export class MessageController {
  constructor(
    @inject('services.MessageAccessor')
    private readonly messageService: MessageAccessor,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [Permissions.CreateMessage]})
  @post('/messages', {
    security: OPERATION_SECURITY_SPEC,
    responses: {},
  })
  async postNewMessage(
    @param.header.string('Authorization') token: string,
    @requestBody() model: PostMessage,
  ): Promise<Object> {
    return await this.messageService.postMessage(token, model);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [Permissions.ViewMessage]})
  @get('/messages', {
    security: OPERATION_SECURITY_SPEC,
    responses: {},
  })
  async getMessages(
    @param.header.string('Authorization') token: string,
  ): Promise<Object> {
    try {
      return await this.messageService.getMessage(token);
    } catch (error) {
      console.log(error);
      throw HttpErrors[500];
    }
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [Permissions.DeleteMessage]})
  @del('/messages/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {},
  })
  async deleteAMessage(
    @param.header.string('Authorization') token: string,
    @param.query.string('id') id: string,
  ) {
    return await this.messageService.deleteMessage(token, id);
  }
}
