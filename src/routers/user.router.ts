import { Router } from "express";
import { authenticateToken } from "../middlewares/authentication.middleware";
import * as usercontroller from "@/controllers/user.controller";
import { validateSchemaMiddleware } from "@/middlewares/universalvalidation.middleware";
import { signUpSchema } from "@/schemas/signup.schema";
import { signInSchema } from "@/schemas/signin.schema";
import { createBillingSchema } from "@/schemas/createbilling.schema";
import { updatepasswordSchema } from "@/schemas/updatepassword.schema";
import { updateBillingSchema } from "@/schemas/updatebilling.schema";

const userRouter = Router()
userRouter.post("/sign-up",validateSchemaMiddleware(signUpSchema) ,usercontroller.signUp);
userRouter.post("/sign-in", validateSchemaMiddleware(signInSchema), usercontroller.signIn)
userRouter.get("/billing/:id", authenticateToken, usercontroller.getBillingAddress)
userRouter.post("/billing", authenticateToken,validateSchemaMiddleware(createBillingSchema), usercontroller.createBillingAddress)
userRouter.post("/changepassword", authenticateToken,validateSchemaMiddleware(updatepasswordSchema) ,usercontroller.changePassword)
userRouter.delete("/billing/:id", authenticateToken, usercontroller.deleteBillingAddress)
userRouter.put("/billing/:id", authenticateToken, validateSchemaMiddleware(updateBillingSchema),usercontroller.updateBillingAddress)
export default userRouter;