import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './notif-service.datasource.config.json';

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class NotifServiceDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'NotifService';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.NotifService', {optional: true})
    dsConfig: object = config,
  ) {
    dsConfig = Object.assign({}, dsConfig, {
      options: {
        baseUrl: process.env.NOTIFICATION_SERVICE_URL,
      },
    });
    super(dsConfig);
  }
}
