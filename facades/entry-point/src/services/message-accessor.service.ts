import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {MessageServiceDataSource} from '../datasources';
import {PostMessage} from '../types';

export interface MessageAccessor {
  postMessage(token: string, data: PostMessage): Promise<Object>;
  getMessage(token: string): Promise<Object>;
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
