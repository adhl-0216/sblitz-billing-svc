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

