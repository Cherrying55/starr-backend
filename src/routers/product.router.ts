import { Router } from "express";
import * as productcontroller from "@/controllers/product.controller";

const productRouter = Router();
productRouter.get("", productcontroller.getAllProducts)
productRouter.get("/:id", productcontroller.getProductByCategoryId)
export default productRouter