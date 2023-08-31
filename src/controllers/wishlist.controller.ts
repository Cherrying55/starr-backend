import { Request, Response } from "express";
import { wishlistservices } from "../services/wishlist.services";

export async function getWishList(req: Request, res: Response){
    const userId = 1;
    try {
        const wishlist = await wishlistservices.getWishList(userId);
        return res.send(wishlist)
    } catch (error) {
        
    }
}

export async function postWishList(req: Request, res: Response){
    const userId = 1;
    const { productId} = req.body;
    try {
        const upserted = await wishlistservices.postWishList(userId, productId)
        return res.send(upserted);
    } catch (error) {
        
    }
}

export async function deleteWishList(req: Request, res: Response){
    const userId = 1;
    const { productId} = req.body;
    try{
        const deleted = await wishlistservices.deleteWishList(userId, productId)
        return res.send(deleted)
    }
    catch(e){
        
    }
}