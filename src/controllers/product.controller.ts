import { productservices } from '../services/product.services';
import { Request, Response } from 'express';
import { ApplicationError } from '@/errors/protocol';
import { handleErrors } from '@/errors/handleerrors';

export async function getAllProducts(req: Request, res: Response) {
  try {
    const products = await productservices.getAllProducts();
    return res.send(products);
  } catch (error) {
    return res.sendStatus(handleErrors(error as ApplicationError));
  }
}

export async function getProductByCategoryId(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const products = await productservices.getProductByCategoryId(Number(id));
    return res.send(products);
  } catch (e) {
    return res.sendStatus(handleErrors(e as ApplicationError));
  }
}
