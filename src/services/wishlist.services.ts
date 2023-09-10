import { conflictError } from '@/errors/conflict.error';
import { wishlistrepository } from '../repositories/wishlist.repository';

async function getWishList(userId: number) {
  const wishlist = await wishlistrepository.getWishList(userId);
  return wishlist;
}

async function postWishList(userId: number, productId: number) {
  //substituivel por upsert
  const already = await wishlistrepository.getWishListByProductId(userId, productId);
  if (already.length !== 0) {
    throw conflictError()
  }
  const wishlist = await wishlistrepository.postWishList(userId, productId);
  return wishlist;
}

async function deleteWishList(userId: number, productId: number) {
  const deleted = await wishlistrepository.deleteWishList(userId, productId);
  return deleted;
}

export const wishlistservices = {
  getWishList,
  postWishList,
  deleteWishList,
};
