export interface Config {
  port: number
}
export const devConfig: Config = {
  port: 3000,
};

export const prodConfig = {
  port: 80,
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

