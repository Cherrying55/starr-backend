import { Request, Response } from 'express';
import { creditService } from '../services/creditcard.services';
import { userservice } from '../services/user.services';
import { AuthenticatedRequest } from '../middlewares/authentication.middleware';
import { createBillingAddressSchema } from '../schemas/createBillingAddress.schema';

export async function signUp(req: Request, res: Response) {
  //const { email, password } = req.body as SignInParams;

  const { email, password, name } = req.body;
  let userdata = { email, password, name };
  try {
    const newuser = await userservice.createUser(userdata);
    return res.send(newuser);
  } catch (error) {}
}

export async function signIn(req: Request, res: Response) {
  const { email, password } = req.body;
  const data = { tokenId: 1, executedAt: new Date().getTime(), status: 'success' };
  try {
    await userservice.createLoginAttempt(data);
    return await userservice.login(email, password);
  } catch (error) {}
}

export async function createBillingAddress(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const data = req.body as createBillingAddressSchema;
  try {
    const billingaddress = await userservice.createBillingAddress(data, userId);
    return billingaddress;
  } catch (e) {}
}

export async function updateBillingAddress(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { id, country, state, city, zipcode, street, number, complemento } = req.body;
  try {
    const updated = await userservice.updateBillingAddress(userId, req.body, id);
    return res.send(updated);
  } catch (e) {}
}

export async function deleteBillingAddress(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { id } = req.body;
  try {
    const deleted = await userservice.deleteBillingAddress(userId, id);
    return res.send(deleted);
  } catch (e) {}
}

export async function changePassword(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { password, newpassword } = req.body;
  try {
    const changed = await userservice.updatePassword(userId, password, newpassword);
    return res.sendStatus(200);
  } catch (error) {}
}
