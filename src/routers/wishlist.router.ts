import { Router } from "express";
import { authenticateToken } from "../middlewares/authentication.middleware";
import * as wishlistcontroller from "@/controllers/wishlist.controller";

const wishListRouter = Router()
wishListRouter.all("/*", authenticateToken)
wishListRouter.get("", wishlistcontroller.getWishList)
wishListRouter.post("", wishlistcontroller.postWishList)
wishListRouter.delete("/:productId", wishlistcontroller.deleteWishList)
export default wishListRouter;