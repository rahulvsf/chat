import {inject, Provider} from '@loopback/core';
import { AnyObject } from '@loopback/repository';
import {getService} from '@loopback/service-proxy';
import {MessageServiceDataSource} from '../datasources';
import { Message } from '../models';

export interface MessageAccessor {
  postMessage(token: string, data: Message): Promise<Message>;
  postMessageRecipients(token: string, data: AnyObject): Promise<AnyObject>;
  getMessage(token: string): Promise<Object>;
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
