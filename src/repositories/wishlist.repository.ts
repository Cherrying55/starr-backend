import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getWishList(userId: number) {
  return prisma.wishListItem.findMany({
    where: {
      userId,
    },
  });
}

function postWishList(userId: number, productId: number) {
  const created = prisma.wishListItem.create({
    data: {
      userId,
      productId,
    },
  });
  return created;
}

function deleteWishList(userId: number, productId: number) {
  const deleted = prisma.wishListItem.deleteMany({
    where: {
      userId,
      productId,
    },
  });
  return deleted;
}

function getWishListByProductId(userId: number, productId: number) {
  //checking if there is already a wish item for the given product
  return prisma.wishListItem.findMany({
    where: {
      userId,
      productId,
    },
  });
}

export const wishlistrepository = {
  getWishList,
  postWishList,
  deleteWishList,
  getWishListByProductId,
};
