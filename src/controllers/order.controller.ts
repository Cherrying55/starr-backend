import { Request, Response } from 'express';
import { orderservices } from '../services/order.services';
import { AuthenticatedRequest } from '../middlewares/authentication.middleware';
import { handleErrors } from '@/errors/handleerrors';
import { ApplicationError } from '@/errors/protocol';
import { CreateCart } from '@/schemas/createCartandWish.schema';

export async function getOrdersByUserId(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const orders = await orderservices.getOrdersByUserId(userId);
    return res.send(orders);
  } catch (error) {
    return res.sendStatus(handleErrors(error as ApplicationError));
  }
}

export async function getOrderItemsByOrderId(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { id } = req.params;
  try {
    const orderitems = await orderservices.getOrderItemsByOrderId(Number(id), userId);
    return res.send(orderitems);
  } catch (error) {
    return res.sendStatus(handleErrors(error as ApplicationError));
  }
}

export async function createOrder(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const body = req.body as CreateCart;
  try {
    const created = await orderservices.createOrderItem(userId, body.quantity, body.productId);
    return res.send(created);
  } catch (error) {
    return res.sendStatus(handleErrors(error as ApplicationError));
  }
}
