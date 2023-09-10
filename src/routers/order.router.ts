import { Router } from 'express';
import { authenticateToken } from '@/middlewares/authentication.middleware';
import * as ordercontroller from '@/controllers/order.controller';
import { validateSchemaMiddleware } from '@/middlewares/universalvalidation.middleware';
import { createCartSchema } from '@/schemas/createCartandWish.schema';

const orderRouter = Router();
orderRouter.get('', authenticateToken, ordercontroller.getOrdersByUserId);
orderRouter.get('/:id', authenticateToken, ordercontroller.getOrderItemsByOrderId);
orderRouter.post('', authenticateToken, validateSchemaMiddleware(createCartSchema), ordercontroller.createOrder);
export default orderRouter;
