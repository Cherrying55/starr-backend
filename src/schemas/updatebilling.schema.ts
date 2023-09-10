import Joi from "joi";

export type UpdateBilling = {
    id: number,
    country: string, 
    state : string, 
    city: string, 
    zipcode : string, 
    street : string, 
    number: string, 
    complemento : string

}

export const updateBillingSchema = Joi.object<UpdateBilling>({
  id: Joi.number().required(),
  country: Joi.string().required(),
  state: Joi.string().required(),
  city: Joi.string().required(),
  zipcode: Joi.string().required(),
  street: Joi.string().required(),
  number: Joi.string().required(),
  complemento: Joi.string().required(),
})