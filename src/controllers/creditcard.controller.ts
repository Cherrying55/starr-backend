import { Request, Response } from 'express';
import { creditService } from '../services/creditcard.services';
import { AuthenticatedRequest } from '../middlewares/authentication.middleware';
import { handleErrors } from '@/errors/handleerrors';
import { ApplicationError } from '@/errors/protocol';
import { PasswordBody } from '@/schemas/passwordBody.schema';
import { Credit } from '@/schemas/credit.schema';

export async function getCreditCards(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const password = req.body as PasswordBody;
  try {
    const creditcard = await creditService.getCreditCards(userId, password.password);
    return res.send(creditcard);
  } catch (error) {
    return res.sendStatus(handleErrors(error as ApplicationError));
  }
}

export async function createCreditCard(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const body = req.body as Credit;
  const data = {
    PAN: body.PAN,
    cardholdername: body.cardholdername,
    brand: body.brand,
    userId,
  };
  try {
    const created = await creditService.createCreditCard(data);
    return res.send(created);
  } catch (error) {
    return res.sendStatus(handleErrors(error as ApplicationError));
  }
}

export async function updateCreditCard(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { creditId } = req.params;
  const body = req.body as Credit;
  const data = {
    PAN: body.PAN,
    cardholdername: body.cardholdername,
    brand: body.brand,
    userId,
  };
  try {
    const updated = await creditService.updateCreditCard(userId, req.body.password, Number(creditId), data);
    return res.send(updated);
  } catch (e) {
    return res.sendStatus(handleErrors(e as ApplicationError));
  }
}

export async function deleteCreditCard(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { creditId } = req.params;
  const password = req.body as PasswordBody;
  try {
    const deleted = await creditService.deleteCreditCard(userId, Number(creditId), password.password);
    return res.send(deleted);
  } catch (e) {
    return res.sendStatus(handleErrors(e as ApplicationError));
  }
}
