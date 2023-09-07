import { creditRepository } from '../repositories/creditcard.repository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userrepository } from '../repositories/user.repository';

async function getCreditCardbyUserId(userId: number, creditId: number) {
  const creditcard = await creditRepository.getCreditCardbyUserId(userId);
  if (creditcard?.id !== creditId) {
    let err = new Error();
    err.name = '403';
    err.message = '403';
    if (creditcard) {
      const token = await creditRepository.getTokenCreditByCreditId(creditcard.id);
      if (token) {
        const newuse = await creditRepository.createTokenCreditUse({
          operationtype: 'getcredit',
          tokenId: token.id,
          status: 'forbbiden',
        });
      }
    }
    throw err;
  }
  return creditcard;
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
  }
  return await creditRepository.updateCreditCard(creditId, data);
}

async function deleteCreditCard(userId: number, creditId: number) {
  const hasuser = await userrepository.getUserById(userId);
  if (!hasuser) {
    let err = new Error();
    err.name = '403';
    err.message = '403';
    throw err;
  }
  const check = await creditRepository.getCreditCardbyUserId(hasuser.id);
  if (check?.id !== creditId) {
    let err = new Error();
    err.name = '403';
    err.message = '403';
    throw err;
  }
  await creditRepository.deleteTokenCredit(creditId);
  return await creditRepository.deleteCreditCard(creditId);
}

export const creditService = {
  getCreditCardbyUserId,
  createCreditCard,
  createCreditToken,
  updateCreditCard,
  deleteCreditCard,
};
