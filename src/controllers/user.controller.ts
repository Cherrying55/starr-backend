import { Request, Response } from 'express';
import { creditService } from '../services/creditcard.services';
import { userservice } from '../services/user.services';
import { AuthenticatedRequest } from '../middlewares/authentication.middleware';
import { createBillingAddressSchema } from '@/schemas/protocols';
import { handleErrors } from '@/errors/handleerrors';
import { ApplicationError } from '@/errors/protocol';
import { SignIn } from '@/schemas/signin.schema';
import { User } from '@/schemas/signup.schema';

export async function signUp(req: Request, res: Response) {
  //const { email, password } = req.body as SignInParams;

  const userdata = req.body as User
  try {
    const newuser = await userservice.createUser(userdata);
    return res.send(newuser);
  } catch (error) {
    return res.sendStatus(handleErrors(error as ApplicationError))
  }
}



export async function signIn(req: Request, res: Response) {
  const { email, password } = req.body as SignIn
  //const data = { tokenId: 1, executedAt: new Date().getTime(), status: 'success' };
  try {
    //await userservice.createLoginAttempt(data);
    return(res.send(await userservice.login(email, password)));
  } catch (error) {
    return res.sendStatus(handleErrors(error as ApplicationError))
  }
}

export async function createBillingAddress(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const data = req.body as createBillingAddressSchema;
  try {
    const billingaddress = await userservice.createBillingAddress(data, userId);
    return res.send(billingaddress);
  } catch (e) {
    return res.sendStatus(handleErrors(e as ApplicationError))
  }
}

export async function getBillingAddress(req: AuthenticatedRequest, res: Response){
  const {userId} = req;
  try {
    const billingaddress = await userservice.getBillingAddress(Number(req.params.id), userId)
    return res.send(billingaddress)
  } catch (error) {
    return res.sendStatus(handleErrors(error as ApplicationError))
  }
}

export async function updateBillingAddress(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { id, country, state, city, zipcode, street, number, complemento } = req.body;
  try {
    const updated = await userservice.updateBillingAddress(userId, req.body, id);
    return res.send(updated);
  } catch (e) {
    return res.sendStatus(handleErrors(e as ApplicationError))
  }
}

export async function deleteBillingAddress(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { id } = req.params
  try {
    const deleted = await userservice.deleteBillingAddress(userId, Number(id));
    return res.send(deleted);
  } catch (error) {
    return res.sendStatus(handleErrors(error as ApplicationError))
  }
}

export async function changePassword(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { password, newpassword } = req.body;
  try {
    const changed = await userservice.updatePassword(userId, password, newpassword);
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(handleErrors(error as ApplicationError))
  }
}
