import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {NotifServiceDataSource} from '../datasources';
import {FcmNotification} from '../models/fcm-notification.model';

export interface FcmNotificationAccessor {
  postNotification(
    token: string,
    data: FcmNotification,
  ): Promise<FcmNotification>;
}

export class FcmNotificationAccessorProvider
  implements Provider<FcmNotificationAccessor>
{
  constructor(
    // NotificationService must match the name property in the datasource json file
    @inject('datasources.NotificationService')
    protected dataSource: NotifServiceDataSource = new NotifServiceDataSource(),
  ) {}

  value(): Promise<FcmNotificationAccessor> {
    return getService(this.dataSource);
  }
}
