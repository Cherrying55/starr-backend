import { Router } from "express";
import { authenticateToken } from "../middlewares/authentication.middleware";
import * as usercontroller from "@/controllers/user.controller";

const userRouter = Router()
userRouter.post("/sign-up", usercontroller.signUp);
userRouter.post("/sign-in", usercontroller.signIn)
userRouter.get("/billing/:id", authenticateToken, usercontroller.getBillingAddress)
userRouter.post("/billing", authenticateToken, usercontroller.createBillingAddress)
userRouter.post("/changepassword", authenticateToken, usercontroller.changePassword)
userRouter.delete("/billing/:id", authenticateToken, usercontroller.deleteBillingAddress)
userRouter.put("/billing/:id", authenticateToken, usercontroller.updateBillingAddress)
export default userRouter;