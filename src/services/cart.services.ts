import { conflictError } from '@/errors/conflict.error';
import { notfoundError } from '@/errors/notfound.error';
import { productrepository } from '@/repositories/product.repository';
import { userrepository } from '@/repositories/user.repository';
import { cartRepository } from '../repositories/cart.repository';

async function getCart(userId: number) {
  const cart = await cartRepository.getCart(userId);
  const hasuser = await userrepository.getUserById(userId)
  if(!hasuser){
    throw notfoundError("User")
  }
  return cart;
}

async function getCartItemByProductId(userId: number, productId: number) {
  const hasproduct = await productrepository.getProductById(productId)
  if(!hasproduct){
    throw notfoundError("Product")
  }
  const hasuser = await userrepository.getUserById(userId)
  if(!hasuser){
    throw notfoundError("User")
  }

  const alreadycart = await cartRepository.getCartItemByProductId(userId, productId);
  if(alreadycart){
    throw conflictError()
  }
  return await cartRepository.getCartItemByProductId(userId, productId);
}

async function createCartItem(userId: number, productId: number, quantity: number) {
  const hasproduct = await productrepository.getProductById(productId)
  if(!hasproduct){
    throw notfoundError("Product")
  }
  const hasuser = await userrepository.getUserById(userId)
  if(!hasuser){
    throw notfoundError("User")
  }
  return await cartRepository.postCartItem(userId, productId, quantity);
}

async function updateCartItem(userId: number, productId: number, quantity: number) {
  const hasproduct = await productrepository.getProductById(productId)
  if(!hasproduct){
    throw notfoundError("Product")
  }
  const hasuser = await userrepository.getUserById(userId)
  if(!hasuser){
    throw notfoundError("User")
  }
  if(hasproduct.stock < quantity){
    throw conflictError()
  }
  return await cartRepository.updateCartItem(userId, productId, quantity);
}

async function deleteCartItem(userId: number, productId: number) {
  const hasproduct = await productrepository.getProductById(productId)
  if(!hasproduct){
    throw notfoundError("Product")
  }
  const hasuser = await userrepository.getUserById(userId)
  if(!hasuser){
    throw notfoundError("User")
  }
  return await cartRepository.deleteCartItem(userId, productId);
}

export const cartService = {
  getCart,
  getCartItemByProductId,
  createCartItem,
  updateCartItem,
  deleteCartItem,
};
