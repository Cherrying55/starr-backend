import { creditRepository } from '../repositories/creditcard.repository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userrepository } from '../repositories/user.repository';

async function getCreditCards(userId: number, password: string) {
  const user = await userrepository.getUserById(userId);
  if(!user){
    return "user not found"
  }
  const creditcards = await creditRepository.getCreditCards(userId);
  if(!creditcards){
    return "cards not found"
  }
  if(!bcrypt.compareSync(password, user.password)){
    let err = new Error();
    err.name = '403';
    err.message = '403';
    return "unauthorized"
  }
  return creditcards;
}

async function createCreditCard(data: any) {
  data.PAN = bcrypt.hashSync(data.PAN, 12);
  const creditcard = await creditRepository.createCreditCard(data);
  await createCreditToken(creditcard.id);
  return creditcard;
}

async function createCreditToken(creditId: number) {
  const token = jwt.sign({ creditId }, 'key');
  return await creditRepository.createCreditToken(creditId, token);
}

async function updateCreditCard(userId: number, password: string, creditId: number, data: any) {
  const hasuser = await userrepository.getUserById(userId);
  console.log(userId)
  console.log(creditId)
  console.log(bcrypt.compareSync(password, hasuser.password))
  if (!hasuser) {
    let err = new Error();
    err.name = '403';
    err.message = '403';
    return("user not found")
    throw err;
  } else {
    if (!bcrypt.compareSync(password, hasuser.password)) {
      let err = new Error();
      err.name = '403';
      err.message = '403';
      return("unauthorized")
      throw err;
    }
  }
  console.log("arrived")
  return await creditRepository.updateCreditCard(creditId, data);
}

async function deleteCreditCard(userId: number, creditId: number, password: string) {
  const user = await userrepository.getUserById(userId);
  if(!user){
    return "user not found"
  }
  const creditcards = await creditRepository.getCreditCards(userId);
  if(!creditcards){
    return "cards not found"
  }
  const check = await creditRepository.getCreditCardbyId(user.id, creditId);
  if(!bcrypt.compareSync(password, user.password)){
    let err = new Error();
    err.name = '403';
    err.message = '403';
    return "unauthorized"
  }
  await creditRepository.deleteTokenCredit(creditId);
  return await creditRepository.deleteCreditCard(creditId);
}

export const creditService = {
  getCreditCards,
  createCreditCard,
  createCreditToken,
  updateCreditCard,
  deleteCreditCard,
};
