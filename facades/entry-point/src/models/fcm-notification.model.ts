import {Entity, model, property} from '@loopback/repository';

@model()
export class FcmNotification extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  subject: string;

  @property({
    type: 'string',
    required: true,
  })
  body: string;

  @property({
    type: 'object',
    required: true,
  })
  receiver: object;

  constructor(data?: Partial<FcmNotification>) {
    super(data);
  }
}
