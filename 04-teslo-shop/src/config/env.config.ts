export const EnvConfiguration = () => ({
  enviroment: process.env.NODE_ENV,
  hostapi: process.env.HOST_API,
  defaultLimit: +process.env.DEFAULT_LIMIT || 5,
});
