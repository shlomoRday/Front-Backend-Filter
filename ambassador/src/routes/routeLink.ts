import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import {
  getLinks,
  CreateLinks,
  Statistic,
  GetLinkByCode
} from "../controllers/link.controller";
const router = Router();
router.use(AuthMiddleware);
router.get("/:id/links", getLinks).get("/stats",Statistic);
router.get("/:code",GetLinkByCode);
router.post("/create",CreateLinks);

export default router;