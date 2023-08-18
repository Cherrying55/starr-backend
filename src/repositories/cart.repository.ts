import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export function getCart(userId: number){
    return prisma.cartItem.findMany({
        where:{
            userId
        }
    })
}

export function postCartItem(userId: number, productId: number, quantity: number){
    return prisma.cartItem.create({
        data:{
            userId,
            productId,
            quantity
        }
    })
}

export function updateCartItem(userId: number, productId: number, quantity: number){
    const updated = prisma.cartItem.updateMany({
        where:{
            userId,
            productId
        },
        data:{
            userId,
            productId,
            quantity
        }
    })
    return updated;
}

export function deleteCartItem(userId: number, productId: number){
    const deleted = prisma.cartItem.deleteMany({
        where:{
            productId,
            userId
        }
    })
    return deleted;
}

export function getCartItemByProductId(userId: number, productId: number){
    //check if there is already a cart item for the given product
    return prisma.cartItem.findMany({
        where:{
            productId,
            userId
        }
    })
}