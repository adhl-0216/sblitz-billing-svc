import { Request } from 'express';
export function getUserId(req: Request): string {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) {
    throw new Error('UserId not found in request headers');
  }
  return userId;
}

export interface Config {
  port: number
}
export const devConfig: Config = {
  port: 5000,
};

export const prodConfig = {
  port: 5000,
};

export const testConfig = {
  port: 3001,
};

export function get_config() {
  const env = process.env.NODE_ENV || 'development';

  switch (env) {
    case 'production':
      return prodConfig;
    case 'development':
      return devConfig;
    case 'testing':
      return testConfig;
    default:
      console.warn(`Unknown NODE_ENV: ${env}, defaulting to devConfig`);
      return devConfig;
  }
}

