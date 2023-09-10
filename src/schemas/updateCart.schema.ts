import Joi from 'joi';

export type UpdateCart = {
  quantity: number;
};

export const updateCartSchema = Joi.object<UpdateCart>({
  quantity: Joi.number().required(),
});
