import { Request, Response } from 'express';
import { creditService } from '../services/creditcard.services';
import { AuthenticatedRequest } from '../middlewares/authentication.middleware';

export async function getCreditCardbyUserId(req: AuthenticatedRequest, res: Response) {
  const { userId, creditId } = req;
  try {
    const creditcard = await creditService.getCreditCardbyUserId(userId, creditId);
    return res.send(creditcard);
  } catch (error) {}
}

export async function createCreditCard(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const data = {
    PAN: req.body.PAN,
    expirationdate: req.body.expirationdate,
    cardholdername: req.body.cardholdername,
    brand: req.body.brand,
    userId,
  };
  try {
    const created = await creditService.createCreditCard(data);
    return res.send(created);
  } catch (error) {}
}

export async function updateCreditCard(req: AuthenticatedRequest, res: Response) {
  const { userId, creditId } = req;
  try {
    const updated = await creditService.updateCreditCard(userId, req.body.password, creditId, req.body);
    return res.send(updated);
  } catch (e) {}
}

export async function deleteCreditCard(req: AuthenticatedRequest, res: Response) {
  const { userId, creditId } = req;
  try {
    const deleted = await creditService.deleteCreditCard(userId, creditId);
    return res.send(deleted);
  } catch (e) {}
}
