import { Router } from "express";
import { authenticateToken } from "@/middlewares/authentication.middleware";
import * as ordercontroller from "@/controllers/order.controller";

const orderRouter = Router()
orderRouter.get("/orders", authenticateToken, ordercontroller.getOrdersByUserId)
orderRouter.get("/order/:id", authenticateToken, ordercontroller.getOrderItemsByOrderId)
orderRouter.post("/orders", authenticateToken, ordercontroller.createOrder)
export default orderRouter