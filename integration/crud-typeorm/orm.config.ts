import { join } from 'path';
import { DataSourceOptions } from 'typeorm';
import { isNil } from '@lab3dvlp/crud-util';

const type = (process.env.TYPEORM_CONNECTION as any) || 'postgres';

export const withCache: DataSourceOptions = {
  type,
  host: '127.0.0.1',
  port: type === 'postgres' ? 5455 : 3316,
  username: type === 'mysql' ? 'nestjsx_crud' : 'root',
  password: type === 'mysql' ? 'nestjsx_crud' : 'root',
  database: 'nestjsx_crud',
  synchronize: false,
  logging: !isNil(process.env.TYPEORM_LOGGING)
    ? !!parseInt(process.env.TYPEORM_LOGGING, 10)
    : true,
  cache: {
    type: 'redis',
    options: {
      host: '127.0.0.1',
      port: 6399,
    },
  },
  entities: [join(__dirname, './**/*.entity{.ts,.js}')],
  migrationsTableName: 'orm_migrations',
  migrations: [
    './seeds.ts'
  ]
};
