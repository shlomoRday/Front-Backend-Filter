import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import {
    Orders
} from "../controllers/order.controller";
const router = Router();
router.use(AuthMiddleware);
router.get("/all", Orders)
export default router;