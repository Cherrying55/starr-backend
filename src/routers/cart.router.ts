import { validateSchemaMiddleware } from '@/middlewares/universalvalidation.middleware';
import { createCartSchema } from '@/schemas/createCartandWish.schema';
import { updateCartSchema } from '@/schemas/updateCart.schema';
import { Router } from 'express';
import {
  getCart,
  getCartItemByProductId,
  postCartItem,
  deleteCartItem,
  updateCartItem,
} from '../controllers/cart.controller';
import { authenticateToken } from '../middlewares/authentication.middleware';

const cartRouter = Router();
cartRouter.all('/*', authenticateToken);
cartRouter.get('', getCart);
cartRouter.get('/:productId', getCartItemByProductId);
cartRouter.post('', validateSchemaMiddleware(createCartSchema), postCartItem);
cartRouter.delete('/:productId', deleteCartItem);
cartRouter.put('/:productId', validateSchemaMiddleware(updateCartSchema), updateCartItem);
export default cartRouter;
