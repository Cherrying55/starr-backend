import { Router } from "express";
import * as creditcontroller from "@/controllers/creditcard.controller";
import { authenticateToken } from "@/middlewares/authentication.middleware";
import { authenticateCreditToken } from "@/middlewares/credit.middleware";

const creditRouter = Router()
creditRouter.get("/credit", authenticateToken, authenticateCreditToken, creditcontroller.getCreditCardbyUserId)
creditRouter.post("/credit", authenticateToken, creditcontroller.createCreditCard)
creditRouter.put("/credit", authenticateToken, authenticateCreditToken, creditcontroller.updateCreditCard)
creditRouter.delete("/credit", authenticateToken, authenticateCreditToken, creditcontroller.deleteCreditCard)
export default creditRouter;