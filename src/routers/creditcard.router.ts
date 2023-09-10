import { Router } from 'express';
import * as creditcontroller from '@/controllers/creditcard.controller';
import { authenticateToken } from '@/middlewares/authentication.middleware';
import { validateSchemaMiddleware } from '@/middlewares/universalvalidation.middleware';
import { creditSchema } from '@/schemas/credit.schema';
import { passwordbodySchema } from '@/schemas/passwordBody.schema';

const creditRouter = Router();
creditRouter.get('', authenticateToken, validateSchemaMiddleware(passwordbodySchema), creditcontroller.getCreditCards);
creditRouter.post('', authenticateToken, validateSchemaMiddleware(creditSchema), creditcontroller.createCreditCard);
creditRouter.put(
  '/:creditId',
  authenticateToken,
  validateSchemaMiddleware(creditSchema),
  creditcontroller.updateCreditCard,
);
creditRouter.delete(
  '/:creditId',
  authenticateToken,
  validateSchemaMiddleware(passwordbodySchema),
  creditcontroller.deleteCreditCard,
);
export default creditRouter;
