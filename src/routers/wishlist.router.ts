import { Router } from "express";
import { authenticateToken } from "../middlewares/authentication.middleware";
import * as wishlistcontroller from "@/controllers/wishlist.controller";

const wishListRouter = Router()
wishListRouter.all("/*", authenticateToken)
wishListRouter.get("/wishlist", wishlistcontroller.getWishList)
wishListRouter.post("/wishlist", wishlistcontroller.postWishList)
wishListRouter.delete("/wishlist/:productId", wishlistcontroller.deleteWishList)
export default wishListRouter;