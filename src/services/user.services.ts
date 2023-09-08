import { userrepository } from '../repositories/user.repository';
import jwt from 'jsonwebtoken';
import { createBillingAddressSchema } from '../schemas/createBillingAddress.schema';
import { User } from '@prisma/client';

import bcrypt from 'bcrypt';
type CreateUserParams = Pick<User, 'email' | 'password' | 'birthDate'>;

async function createUser(data:any) {
  const hashedPassword = bcrypt.hashSync(data.password, 12);
  console.log(hashedPassword)
  data.password = hashedPassword;
  console.log(data.password)
  const newuser = await userrepository.createUser(data);
  console.log(newuser);
  return newuser;
}

async function login(email: string, password: string) {
  const hasuser = await userrepository.getUserByEmail(email);
  if (!hasuser) {
    let err = new Error();
    err.name = '403';
    err.message = '403';
    throw err;
  } else {
    if (!bcrypt.compareSync(hasuser.password, password)) {
      let err = new Error();
      err.name = '403';
      err.message = '403';
      const token = await userrepository.getUserSessionByUserId(hasuser.id);
      if (token) {
        const newloginattempt = await userrepository.createLoginAttempt({ status: 'forbbiden', tokenId: token.id });
      }
      throw err;
    }
    return createSession(hasuser.id);
  }
}

async function createSession(userId: number) {
  const token = jwt.sign({ userId }, 'key');
  const session = await userrepository.createSession(userId, token);
  return session;
}

async function createLoginAttempt(data: any) {
  const loginattempt = await userrepository.createLoginAttempt(data);
  return loginattempt;
}

async function createBillingAddress(data: createBillingAddressSchema, userId: number) {
  data.userId = userId;
  const billingaddress = await userrepository.createBillingAddress(data);
  return billingaddress;
}

async function updatePassword(userId: number, password: string, newpassword: string) {
  const hasuser = await userrepository.getUserById(userId);
  if (!hasuser) {
    let err = new Error();
    err.name = '403';
    err.message = '403';
    throw err;
  } else {
    if (!bcrypt.compareSync(hasuser.password, password)) {
      let err = new Error();
      err.name = '403';
      err.message = '403';
      throw err;
    }
    const retiredpassword = await userrepository.createRetiredPassword({ userId, password });
    newpassword = await bcrypt.hash(newpassword, 12);
    const updatepassword = await userrepository.updatePassword(userId, newpassword);
    return updatepassword;
  }
}

async function updateBillingAddress(userId: number, data: any, id: number) {
  //check if it exists
  const hasbillingaddress = await userrepository.getBillingAdressbyId(userId, id);
  if (!hasbillingaddress) {
    throw new Error();
  }
  const updatebillingaddress = await userrepository.updateBillingAddress(userId, id, data);
  return updatebillingaddress;
}

async function deleteBillingAddress(userId: number, id: number) {
  const hasbillingaddress = await userrepository.getBillingAdressbyId(userId, id);
  if (!hasbillingaddress) {
    throw new Error();
  }
  const deletebillingaddress = await userrepository.deleteBillingAddress(userId, id);
  return deletebillingaddress;
}

async function getBillingAddress(id: number, userId: number){
  return await userrepository.getBillingAdressbyId(userId,id)
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
  getBillingAddress
};
