import { Router } from "express";
import * as creditcontroller from "@/controllers/creditcard.controller";
import { authenticateToken } from "@/middlewares/authentication.middleware";

const creditRouter = Router()
creditRouter.get("", authenticateToken, creditcontroller.getCreditCards)
creditRouter.post("", authenticateToken, creditcontroller.createCreditCard)
creditRouter.put("/:creditId", authenticateToken, creditcontroller.updateCreditCard)
creditRouter.delete("/:creditId", authenticateToken, creditcontroller.deleteCreditCard)
export default creditRouter;