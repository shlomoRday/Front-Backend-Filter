import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import {
  CreateProduct,
  GetProduct,
  UpdateProduct,
  DeleteProduct,
} from "../controllers/product.controller";
const router = Router();
router.use(AuthMiddleware);
router
  .post("/create", CreateProduct)
  .get("/:id/", GetProduct)
  .put("/:id/edit", UpdateProduct)
  .delete("/:id", DeleteProduct);
export default router;