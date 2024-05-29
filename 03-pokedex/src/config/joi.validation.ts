import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  MONGODB_URL: Joi.required(),
  PORT: Joi.number().default(3003),
  NODE_ENV: Joi.string().default('dev'),
  DEFAULT_LIMIT: Joi.number().default(7),
});
