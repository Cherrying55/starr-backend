import { Request, Response } from 'express';
import { orderservices } from '../services/order.services';
import { AuthenticatedRequest } from '../middlewares/authentication.middleware';

export async function getOrdersByUserId(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const orders = await orderservices.getOrdersByUserId(userId);
    return res.send(orders);
  } catch (error) {}
}

export async function getOrderItemsByOrderId(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { id } = req.params
  try {
    const orderitems = await orderservices.getOrderItemsByOrderId(Number(id), userId);
    return res.send(orderitems);
  } catch (error) {}
}

export async function createOrder(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { orderId, quantity, productId } = req.body;
  try {
    const created = await orderservices.createOrderItem(userId, orderId, quantity, productId);
    return res.send(created);
  } catch (error) {}
}
