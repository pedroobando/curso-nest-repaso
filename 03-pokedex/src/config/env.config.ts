export const EnvConfiguration = () => ({
  enviroment: process.env.NODE_ENV,
  defaultLimit: +process.env.DEFAULT_LIMIT || 5,
});
