import { wishlistrepository } from '../repositories/wishlist.repository';

async function getWishList(userId: number) {
  const wishlist = await wishlistrepository.getWishList(userId);
  if (!wishlist) {
    throw {};
  }
  return wishlist;
}

async function postWishList(userId: number, productId: number) {
  //substituivel por upsert
  const already = await wishlistrepository.getWishListByProductId(userId, productId);
  if (already) {
    throw {};
  }
  const wishlist = await wishlistrepository.postWishList(userId, productId);
  if (!wishlist) {
    throw {};
  }
  return wishlist;
}

async function deleteWishList(userId: number, productId: number) {
  const deleted = await wishlistrepository.deleteWishList(userId, productId);
  if (!deleted) {
    throw {};
  }
  return deleted;
}

export const wishlistservices = {
  getWishList,
  postWishList,
  deleteWishList,
};
