import { creditRepository } from '../repositories/creditcard.repository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userrepository } from '../repositories/user.repository';
import { notfoundError } from '@/errors/notfound.error';
import { unauthorizedError } from '@/errors/unauthorized.error';

async function getCreditCards(userId: number, password: string) {
  const user = await userrepository.getUserById(userId);
  if (!user) {
    throw notfoundError('User');
  }
  const creditcards = await creditRepository.getCreditCards(userId);
  if (!bcrypt.compareSync(password, user.password)) {
    throw unauthorizedError();
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
  if (!hasuser) {
    throw notfoundError('User');
  } else {
    if (!bcrypt.compareSync(password, hasuser.password)) {
      throw unauthorizedError();
    }
  }
  const creditcard = await creditRepository.getCreditCardbyId(userId, creditId);
  if (!creditcard) {
    throw notfoundError('Credit card');
  }
  return await creditRepository.updateCreditCard(creditId, data);
}

async function deleteCreditCard(userId: number, creditId: number, password: string) {
  const user = await userrepository.getUserById(userId);
  if (!user) {
    throw notfoundError('User');
  }
  const creditcard = await creditRepository.getCreditCardbyId(userId, creditId);
  if (!creditcard) {
    throw notfoundError('Credit card');
  }
  if (!bcrypt.compareSync(password, user.password)) {
    throw unauthorizedError();
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
