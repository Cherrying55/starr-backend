import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function getWishList(userId: number){
    return prisma.wishListItem.findMany({
        where:{
            userId
        }
    })
}

export function postWishList(userId: number, productId: number, quantity: number){
    const created = prisma.wishListItem.create({
        data:{
            userId,
            productId
        }
    })
    return created;
}


export function deleteWishList(userId: number, productId: number, quantity: number){
    const deleted = prisma.wishListItem.deleteMany({
        where:{
            userId,
            productId
        }
    })
    return deleted;
}

export function getWishListByProductId(userId: number, productId: number){
    //checking if there is already a wish item for the given product
    return prisma.wishListItem.findMany({
        where:{
            userId,
            productId
        }
    })
}