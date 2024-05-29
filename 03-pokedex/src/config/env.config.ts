//* Esto es util dentro de los modulos de NESTJS
//* Este hace las conversiones y mapeos de las variables de entorno

export const EnvConfiguration = () => ({
  enviroment: process.env.NODE_ENV,
  mongodb: process.env.MONGODB_URI,
  port: process.env.PORT || 3002,
  defaultLimit: +process.env.DEFAULT_LIMIT || 5,
});
