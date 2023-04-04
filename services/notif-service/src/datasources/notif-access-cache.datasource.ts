import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'NotifAccessCache',
  connector: 'kv-redis',
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  db: process.env.REDIS_DATABASE,
  url: process.env.REDIS_URL,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class NotifAccessCacheDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'NotifAccessCache';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.NotifAccessCache', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
