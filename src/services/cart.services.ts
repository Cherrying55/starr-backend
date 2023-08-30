import { cartRepository } from "../repositories/cart.repository";

async function getCart(userId: number){
    return await cartRepository.getCart(userId)
}

async function getCartItemByProductId(userId: number, productId: number){
    return await cartRepository.getCartItemByProductId(userId, productId)
}

async function createCartItem(userId: number, productId: number, quantity: number){
    return await cartRepository.postCartItem(userId, productId, quantity )
}

async function updateCartItem(userId: number, productId: number, quantity: number){
    return await cartRepository.updateCartItem(userId, productId, quantity)
}

async function deleteCartItem(id: number){
    return await cartRepository.deleteCartItem(id)
}

export const cartService = {
    getCart,
    getCartItemByProductId,
    createCartItem,
    updateCartItem,
    deleteCartItem
}