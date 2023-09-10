import Joi from 'joi';

export type Credit = {
  PAN: string;
  cardholdername: string;
  brand: string;
};

export const creditSchema = Joi.object<Credit>({
  PAN: Joi.string().required(),
  cardholdername: Joi.string().required(),
  brand: Joi.string().required(),
});
