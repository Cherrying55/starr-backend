import Joi from 'joi';

export type CreateBilling = {
  country: string;
  state: string;
  city: string;
  zipcode: string;
  street: string;
  number: string;
  complemento: string;
};

export const createBillingSchema = Joi.object<CreateBilling>({
  country: Joi.string().required(),
  state: Joi.string().required(),
  city: Joi.string().required(),
  zipcode: Joi.string().required(),
  street: Joi.string().required(),
  number: Joi.string().required(),
  complemento: Joi.string().required(),
});
