import Joi from "joi";

export type SignIn = {
    email: string,
    password: string

}

export const signInSchema = Joi.object<SignIn>({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(3)
})