import { Request, Response, NextFunction } from 'express';

export default function methodOverride(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method.toUpperCase();
    delete req.body._method;
    req.method = method;
  }
  next();
}
