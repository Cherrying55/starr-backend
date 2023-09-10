import Joi from "joi";

export type User = {
    name: string,
    email: string,
    password: string,
    birthDate?: string

}

export const signUpSchema = Joi.object<User>({
  name: Joi.string().required(),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(3)
})