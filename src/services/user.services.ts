import { userrepository } from '../repositories/user.repository';
import jwt from 'jsonwebtoken';
import { createBillingAddressSchema } from '../schemas/createBillingAddress.schema';
import { User, UserSession } from '@prisma/client';

import bcrypt from 'bcrypt';
type CreateUserParams = Pick<User, 'email' | 'password' | 'birthDate'>;

async function createUser(data:any) {
  const hasuser = await userrepository.getUserByEmail(data.email);
  if(hasuser){
    console.log(hasuser)
    //fix me
    return hasuser
  }
  const hashedPassword = bcrypt.hashSync(data.password, 12);
  data.password = hashedPassword;
  const newuser = await userrepository.createUser(data);
  return newuser;
}

async function login(email: string, password: string) {
  const hasuser = await userrepository.getUserByEmail(email);
  console.log(hasuser.password)
  console.log(password)
  console.log(bcrypt.compareSync(`${password}`, hasuser.password))
  if (!hasuser) {
    let err = new Error();
    err.name = '403';
    err.message = '403';
    return("error")
    throw err;
    return("error")
  } else {
    if (!bcrypt.compareSync(`${password}`, hasuser.password)) {
      let err = new Error();
      err.name = '403';
      err.message = '403';
      const token = await userrepository.getUserSessionByUserId(hasuser.id);
      if (token) {
        const newloginattempt = await userrepository.createLoginAttempt({ status: 'forbbiden', tokenId: token.id });
      }
      return "error"
    }
    console.log("return will arrive")
    return createSession(hasuser.id);
  }
}

async function createSession(userId: number) {
  console.log("token will be made")
  const token = jwt.sign({ userId }, 'key');
  console.log(token)
  type TokenParams = Pick<UserSession, 'userId' | 'token'>;
  const data : TokenParams = {userId, token}
  const session = await userrepository.createSession(data);
  return session.token
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
