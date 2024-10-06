export const EnvConfiguration = () => ({
  enviroment: process.env.NODE_ENV,
  hostapi: process.env.HOST_API,
  defaultLimit: +process.env.DEFAULT_LIMIT || 5,
  s3_userName: process.env.S3_USERNAME,
  s3_password: process.env.S3_PASSWORD,
  s3_endpoint: process.env.S3_ENDPOINT,
  s3_port: +process.env.S3_PORT || 9000,
  s3_bucket: process.env.S3_BUCKET,
});
