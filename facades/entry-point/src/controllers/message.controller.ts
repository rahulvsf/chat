import {inject} from '@loopback/context';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/openapi-v3';
import {Filter, Where} from '@loopback/repository';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {Permissions} from '../enums';
import {Message, MessageRecipient} from '../models';
import {MessageAccessor} from '../services';

export class MessageController {
  constructor(
    @inject('services.MessageAccessor')
    private readonly messageService: MessageAccessor,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [Permissions.CreateMessage]})
  @post('/messages', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(Message),
          },
        },
      },
    },
  })
  async postNewMessage(
    @param.header.string('Authorization') token: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Message, {
            title: 'Message',
            exclude: ['id'],
          }),
        },
      },
    })
    model: Message,
  ) {
    const postedMessage = await this.messageService.postMessage(token, model);
    const messageRecipient = new MessageRecipient({
      channelId: model.channelId,
      recipientId: model.toUserId,
      messageId: postedMessage.id,
    });
    await this.messageService.postMessageRecipients(token, messageRecipient);
    return postedMessage;
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @patch(`messages/{messageid}/read`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Message PATCH success',
      },
    },
  })
  async patchMessageRecipients(
    @param.header.string('Authorization') token: string,
    @param.path.string('messageid') msgId: string,
    @param.query.object('where', getWhereSchemaFor(MessageRecipient))
    where?: Where<MessageRecipient>,
  ): Promise<MessageRecipient> {
    const patched = {
      isRead: true,
    };
    return this.messageService.updateMessageRecipients(
      token,
      msgId,
      patched,
      where,
    );
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [Permissions.ViewMessage]})
  @get('/messages', {
    security: OPERATION_SECURITY_SPEC,
    responses: {},
  })
  async getMessages(
    @param.header.string('Authorization') token: string,
    @param.query.string('ChannelId') channelId: string,
  ) {
    const filter: Filter<Message> = {
      where: {
        channelId,
      },
      fields: ['body', 'id', 'toUserId', 'channelId'],
      order: ['createdOn DESC'],
    };
    return await this.messageService.getMessage(token, filter);
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
