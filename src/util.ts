import { Request } from 'express';
export function getUserId(req: Request): string {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) {
    throw new Error('UserId not found in request headers');
  }
  return userId;
}

