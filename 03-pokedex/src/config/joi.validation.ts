import * as Joi from 'joi';

//* Esto valida el schema a nivel global, estableciendo las reglas

export const JoiValidationSchema = Joi.object({
  MONGODB_URI: Joi.required(),
  PORT: Joi.number().default(3003),
  NODE_ENV: Joi.string().default('dev'),
  DEFAULT_LIMIT: Joi.number().default(7),
});
