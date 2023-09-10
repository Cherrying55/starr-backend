import { Request, Response } from 'express';
import { wishlistservices } from '../services/wishlist.services';
import { AuthenticatedRequest } from '../middlewares/authentication.middleware';
import { handleErrors } from '@/errors/handleerrors';
import { ApplicationError } from '@/errors/protocol';

export async function getWishList(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const wishlist = await wishlistservices.getWishList(userId);
    return res.send(wishlist);
  } catch (error) {
    return res.sendStatus(handleErrors(error as ApplicationError))
  }
}

export async function postWishList(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { productId } = req.body;
  try {
    const upserted = await wishlistservices.postWishList(userId, productId);
    return res.send(upserted);
  } catch (error) {
    return res.sendStatus(handleErrors(error as ApplicationError))
  }
}

export async function deleteWishList(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { productId } = req.params
  try {
    const deleted = await wishlistservices.deleteWishList(userId, Number(productId));
    return res.send(deleted);
  } catch (e) {
    return res.sendStatus(handleErrors(e as ApplicationError))
  }
}
