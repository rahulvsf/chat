import {Entity, model, property} from '@loopback/repository';

@model()
export class Message extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  subject?: string;

  @property({
    type: 'string',
    required: true,
  })
  body: string;

  @property({
    type: 'string',
    required: true,
  })
  toUserId: string;

  @property({
    type: 'string',
    required: true,
  })
  channelId: string;

  @property({
    type: 'string',
    required: true,
  })
  channelType: string;


  constructor(data?: Partial<Message>) {
    super(data);
  }
}