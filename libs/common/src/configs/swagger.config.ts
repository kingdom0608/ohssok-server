import { INestApplication } from '@nestjs/common';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import { SwaggerTheme } from 'swagger-themes';
import * as fs from 'fs';

export function setupSwagger(app: INestApplication) {
  const file = './package.json';
  const packageJsonData = JSON.parse(fs.readFileSync(file, 'utf8'));
  const theme = new SwaggerTheme('v3');
  const options = new DocumentBuilder()
    .setTitle(`ohssok-api-server`)
    .setDescription(`ohssok-api-server`)
    .setVersion(`${packageJsonData.version}`)
    .addApiKey(
      { type: 'apiKey', in: 'header', name: 'x-access-token' },
      'authentication',
    )
    .build();
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customCss: theme.getBuffer('dark'),
    customSiteTitle: 'ohssok-api-server',
  };
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(
    `/${packageJsonData.version}/docs`,
    app,
    document,
    customOptions,
  );
}
