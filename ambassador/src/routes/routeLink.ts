import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import {
  getLinks
} from "../controllers/link.controller";
const router = Router();
router.use(AuthMiddleware);
router.get("/:id/links", getLinks)
export default router;