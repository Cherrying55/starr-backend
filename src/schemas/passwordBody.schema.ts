import Joi from 'joi';

export type PasswordBody = {
  password: string;
};

export const passwordbodySchema = Joi.object<PasswordBody>({
  password: Joi.string().required(),
});
