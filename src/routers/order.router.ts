import { Router } from "express";
import { authenticateToken } from "@/middlewares/authentication.middleware";
import * as ordercontroller from "@/controllers/order.controller";

const orderRouter = Router()
orderRouter.get("", authenticateToken, ordercontroller.getOrdersByUserId)
orderRouter.get("/:id", authenticateToken, ordercontroller.getOrderItemsByOrderId)
orderRouter.post("", authenticateToken, ordercontroller.createOrder)
export default orderRouter