import { NestFactory } from '@nestjs/core';
import { isLocal } from '@app/common';
import { EventServerModule } from './event-server.module';

async function bootstrap() {
  const app = await NestFactory.create(EventServerModule);
  const port = 4000;

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use('/ping', async function (req: any, res: any) {
    res.status(200).send('ok');
  });

  await app.listen(port);

  if (isLocal()) {
    console.log(`✅ event-server ready at http://localhost:${port}`);
  }
}
bootstrap();
