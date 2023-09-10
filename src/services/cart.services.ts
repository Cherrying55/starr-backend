import { cartRepository } from '../repositories/cart.repository';

async function getCart(userId: number) {
  const cart = await cartRepository.getCart(userId);
  console.log(cart)
  return cart;
}

async function getCartItemByProductId(userId: number, productId: number) {
  //check if product, if not then ''Product not Found 404''
  //check if user, if not then ''User not Found 404''
  //check if already on cart
  return await cartRepository.getCartItemByProductId(userId, productId);
}

async function createCartItem(userId: number, productId: number, quantity: number) {
  return await cartRepository.postCartItem(userId, productId, quantity);
}

async function updateCartItem(userId: number, productId: number, quantity: number) {
  return await cartRepository.updateCartItem(userId, productId, quantity);
}

async function deleteCartItem(userId: number, productId: number) {
  return await cartRepository.deleteCartItem(userId, productId);
}

export const cartService = {
  getCart,
  getCartItemByProductId,
  createCartItem,
  updateCartItem,
  deleteCartItem,
};
