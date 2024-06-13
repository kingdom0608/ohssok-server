import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    req.url !== '/' &&
      console.log(
        JSON.stringify({
          host: req.hostname,
          url: req.url,
          method: req.method,
          query: req.query,
          data: req.body,
          token: req.headers['x-access-token'],
          userAgent: req.headers['user-agent'],
          memory: `${Math.round(used * 100) / 100} MB`,
          cpu: process.cpuUsage(),
        }),
      );
    next();
  }
}
