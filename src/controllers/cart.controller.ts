import { cartService } from "../services/cart.services";
import { Request, Response } from "express";

export async function getCart(req: Request, res: Response){
    //const { userId } = req;
    const userId = 1;
    try {
        const cart = cartService.getCart(userId)
        return res.send(cart)
    } catch (error) {
        
    }
}

export async function getCartItemByProductId(req: Request, res: Response){
    //const { userId } = req;
    const userId = 1
    const { productId } = req.body;

    try{
        const cartitems = await cartService.getCartItemByProductId(userId, productId)
        return res.send(cartitems)
    }
    catch(e){

    }
}

export async function postCartItem(req: Request, res: Response){
    const userId = 1;
    const { productId, quantity} = req.body;

    try{
        const created = await cartService.createCartItem(userId, productId, quantity)
        return res.send(created)
    }
    catch(e){

    }
}

export async function deleteCartItem(req: Request, res: Response){
    const userId = 1;
    const { productId } = req.body;
    try {
        const deleted = await cartService.deleteCartItem(userId, productId)
        return res.send(deleted)
    } catch (error) {
        
    }

}

export async function updateCartItem(req: Request, res: Response){
    const userId = 1;
    const { productId, quantity} = req.body;

    try{
        const updated = await cartService.updateCartItem(userId, productId, quantity)
        return res.send(updated)
    }
    catch(e){

    }
}