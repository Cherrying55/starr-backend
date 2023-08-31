import { Request, Response } from "express";
import { orderservices } from "../services/order.services";

export async function getOrdersByUserId(req: Request, res: Response){
    const userId = 1;
    try {
        const orders = await orderservices.getOrdersByUserId(userId)
        return res.send(orders)
    } catch (error) {
        
    }
}

export async function getOrderItemsByOrderId(req: Request, res: Response){
    const userId = 1;
    const { orderId } = req.body;
    try {
        const orderitems = await orderservices.getOrderItemsByOrderId(orderId);
        return res.send(orderitems)
    } catch (error) {
        
    }
}

export async function createOrder(req: Request, res: Response){
    const userId = 1;
    const {orderId, quantity, productId} = req.body
    try {
        const created = await orderservices.createOrderItem(userId, orderId, quantity,productId)
        return res.send(created)
    } catch (error) {
        
    }
}

