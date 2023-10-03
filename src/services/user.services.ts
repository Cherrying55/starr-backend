import { userrepository } from '../repositories/user.repository';
import jwt from 'jsonwebtoken';
import { createBillingAddressSchema } from '@/schemas/protocols';
import { User, UserSession } from '@prisma/client';

import bcrypt from 'bcrypt';
import { conflictError } from '@/errors/conflict.error';
import { notfoundError } from '@/errors/notfound.error';
import { unauthorizedError } from '@/errors/unauthorized.error';
import { CreateBilling } from '@/schemas/createbilling.schema';
type CreateUserParams = Pick<User, 'email' | 'password' | 'birthDate'>;

async function createUser(data: any) {
  const hasuser = await userrepository.getUserByEmail(data.email);
  if (hasuser) {
    throw conflictError();
  }
  const hashedPassword = bcrypt.hashSync(data.password, 12);
  data.password = hashedPassword;
  const newuser = await userrepository.createUser(data);
  return newuser;
}

async function login(email: string, password: string) {
  const hasuser = await userrepository.getUserByEmail(email);
  if (!hasuser) {
    throw notfoundError('User');
  } else {
    if (!bcrypt.compareSync(`${password}`, hasuser.password)) {
      const token = await userrepository.getUserSessionByUserId(hasuser.id);
      if (token) {
        const newloginattempt = await userrepository.createLoginAttempt({ status: 'forbbiden', tokenId: token.id });
      }
      throw unauthorizedError();
    }
    const token = await createSession(hasuser.id);
    return {name: hasuser.name, email:hasuser.email, birthday: hasuser.birthDate, token}
  }
}

async function createSession(userId: number) {
  console.log('token will be made');
  const token = jwt.sign({ userId }, 'key');
  console.log(token);
  type TokenParams = Pick<UserSession, 'userId' | 'token'>;
  const data: TokenParams = { userId, token };
  const session = await userrepository.createSession(data);
  return session.token;
}

async function createLoginAttempt(data: any) {
  const loginattempt = await userrepository.createLoginAttempt(data);
  return loginattempt;
}

async function createBillingAddress(data: CreateBilling, userId: number) {
  const hasuser = await userrepository.getUserById(userId);
  if (!hasuser) {
    throw notfoundError('User');
  }
  const createdata = {...data, userId}
  const billingaddress = await userrepository.createBillingAddress(createdata);
  return billingaddress;
}

async function updatePassword(userId: number, password: string, newpassword: string) {
  const hasuser = await userrepository.getUserById(userId);
  if (!hasuser) {
    throw notfoundError('User');
  } else {
    if (!bcrypt.compareSync(password, hasuser.password)) {
      throw unauthorizedError();
    }
    const retiredpassword = await userrepository.createRetiredPassword({ userId, password });
    newpassword = await bcrypt.hash(newpassword, 12);
    const updatepassword = await userrepository.updatePassword(userId, newpassword);
    return updatepassword;
  }
}

async function updateBillingAddress(userId: number, data: any, id: number) {
  const hasuser = await userrepository.getUserById(userId);
  if (!hasuser) {
    throw notfoundError('User');
  }
  const hasbillingaddress = await userrepository.getBillingAdressbyId(userId, id);
  if (!hasbillingaddress) {
    throw notfoundError('Billing address');
  }
  const updatebillingaddress = await userrepository.updateBillingAddress(userId, id, data);
  return updatebillingaddress;
}

async function deleteBillingAddress(userId: number, id: number) {
  const hasuser = await userrepository.getUserById(userId);
  if (!hasuser) {
    throw notfoundError('User');
  }
  const hasbillingaddress = await userrepository.getBillingAdressbyId(userId, id);
  if (!hasbillingaddress) {
    throw notfoundError('Billing address');
  }
  const deletebillingaddress = await userrepository.deleteBillingAddress(userId, id);
  return deletebillingaddress;
}

async function getBillingAddress(userId: number) {
  const hasuser = await userrepository.getUserById(userId);
  if (!hasuser) {
    throw notfoundError('User');
  }
  return await userrepository.getBillingAddresses(userId)
}
export const userservice = {
  createUser,
  createSession,
  createLoginAttempt,
  createBillingAddress,
  updateBillingAddress,
  updatePassword,
  login,
  deleteBillingAddress,
  getBillingAddress,
};
