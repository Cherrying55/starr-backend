import { Router } from "express";
import { getCart, getCartItemByProductId, postCartItem, deleteCartItem, updateCartItem } from "../controllers/cart.controller";
import { authenticateToken } from "../middlewares/authentication.middleware";

const cartRouter = Router()
cartRouter.all("/*", authenticateToken)
cartRouter.get("/cart", getCart)
cartRouter.get("/cart/:id", getCartItemByProductId)
cartRouter.post("/cart", postCartItem)
cartRouter.delete("/cart/:productId", deleteCartItem)
cartRouter.put("/cart/:productId", updateCartItem)
export default cartRouter;