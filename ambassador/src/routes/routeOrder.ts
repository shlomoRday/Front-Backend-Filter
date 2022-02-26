import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import {
    Orders,CreateOreder,
    ConfirmPaymentOrder
} from "../controllers/order.controller";
const router = Router();
router.use(AuthMiddleware);
router.get("/all", Orders)
router.post("/create",CreateOreder);
router.post("/order/payment/confirm",ConfirmPaymentOrder)
export default router;