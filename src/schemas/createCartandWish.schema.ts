import Joi from "joi";

export type CreateCart = {
    productId: number,
    quantity: number

}

export const createCartSchema = Joi.object<CreateCart>({
  productId: Joi.number().required(),
  quantity: Joi.number().required(),
})