import {inject, Provider} from '@loopback/core';
import {Filter, Where} from '@loopback/repository';
import {getService} from '@loopback/service-proxy';
import {MessageServiceDataSource} from '../datasources';
import {Message, MessageRecipient} from '../models';

export interface MessageAccessor {
  postMessage(token: string, data: Message): Promise<Message>;
  postMessageRecipients(
    token: string,
    data: MessageRecipient,
  ): Promise<MessageRecipient>;
  getMessage(token: string, filter?: Filter<Message>): Promise<Message[]>;
  updateMessageRecipients(
    token: string,
    id: string,
    data: Partial<MessageRecipient>,
    where?: Where<MessageRecipient>,
  ): Promise<MessageRecipient>;
  deleteMessage(token: string, id: string): Promise<void>;
}

export class MessageAccessorProvider implements Provider<MessageAccessor> {
  constructor(
    // MessageService must match the name property in the datasource json file
    @inject('datasources.MessageService')
    protected dataSource: MessageServiceDataSource = new MessageServiceDataSource(),
  ) {}

  value(): Promise<MessageAccessor> {
    return getService(this.dataSource);
  }
}
