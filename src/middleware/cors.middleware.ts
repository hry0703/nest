// src/middleware/cors.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
 
@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, X-Requested-With, Origin, X-Custom-Header');
 
    if (req.method === 'OPTIONS') {
      res.send(200);
    } else {
      next();
    }
  }
}