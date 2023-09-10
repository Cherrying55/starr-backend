import { Router } from "express";
import { getCart, getCartItemByProductId, postCartItem, deleteCartItem, updateCartItem } from "../controllers/cart.controller";
import { authenticateToken } from "../middlewares/authentication.middleware";

const cartRouter = Router()
cartRouter.all("/*", authenticateToken)
cartRouter.get("", getCart)
cartRouter.get("/:productId", getCartItemByProductId)
cartRouter.post("", postCartItem)
cartRouter.delete("/:productId", deleteCartItem)
cartRouter.put("/:productId", updateCartItem)
export default cartRouter;