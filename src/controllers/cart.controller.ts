import { cartService } from '../services/cart.services';
import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authentication.middleware';

export async function getCart(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const cart = await cartService.getCart(userId);
    return res.send(cart);
  } catch (error) {}
}

export async function getCartItemByProductId(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { productId } = req.params

  try {
    const cartitems = await cartService.getCartItemByProductId(userId, Number(productId));
    return res.send(cartitems);
  } catch (e) {}
}

export async function postCartItem(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { productId, quantity} = req.body

  try {
    const created = await cartService.createCartItem(userId, Number(productId), quantity);
    return res.send(created);
  } catch (e) {}
}

export async function deleteCartItem(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { productId} = req.params
  try {
    const deleted = await cartService.deleteCartItem(userId, Number(productId));
    return res.send(deleted);
  } catch (error) {}
}

export async function updateCartItem(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { productId} = req.params
  const {quantity} = req.body;

  try {
    const updated = await cartService.updateCartItem(userId, Number(productId), quantity);
    return res.send(updated);
  } catch (e) {}
}
