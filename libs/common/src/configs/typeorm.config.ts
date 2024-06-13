import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { isLocal } from '@app/common/configs/env.config';
import * as process from 'process';
import { DefaultNamingStrategy } from 'typeorm';
import { camelCase } from 'typeorm/util/StringUtils';

export class TypeOrmNamingStrategy extends DefaultNamingStrategy {
  tableName(targetName: string, userSpecifiedName: string | undefined): string {
    const table = camelCase(super.tableName(targetName, userSpecifiedName));
    return table[0].toUpperCase() + table.slice(1);
  }
}

export function generateTypeormModuleOptions(
  configService: ConfigService,
  domainName: string,
): TypeOrmModuleOptions {
  return {
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: 3306,
    database: domainName,
    timezone: '+09:00',
    namingStrategy: new TypeOrmNamingStrategy(),
    synchronize: isLocal(),
    logging: isLocal(),
    keepConnectionAlive: true,
    autoLoadEntities: true,
  };
}
