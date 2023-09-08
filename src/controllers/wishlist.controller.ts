import { Request, Response } from 'express';
import { wishlistservices } from '../services/wishlist.services';
import { AuthenticatedRequest } from '../middlewares/authentication.middleware';

export async function getWishList(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const wishlist = await wishlistservices.getWishList(userId);
    return res.send(wishlist);
  } catch (error) {}
}

export async function postWishList(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { productId } = req.body;
  try {
    const upserted = await wishlistservices.postWishList(userId, productId);
    return res.send(upserted);
  } catch (error) {}
}

export async function deleteWishList(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { productId } = req.params
  try {
    const deleted = await wishlistservices.deleteWishList(userId, Number(productId));
    return res.send(deleted);
  } catch (e) {}
}
