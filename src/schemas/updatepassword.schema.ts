import Joi from "joi";

export type UpdatePassword = {
    password: string, 
    newpassword: string

}

export const updatepasswordSchema = Joi.object<UpdatePassword>({
  password: Joi.string().required(),
  newpassword: Joi.string().required()
})