import { Router } from "express";
import {
  RestritLogin,
  Register,
  AuthenticatedUser,
  Logout,
  UpdateProfile,
  UpdatePassword,
} from "../controllers/auth.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import {Ranking} from "../controllers/user.controller";
const router = Router();

router.post("/register", Register);
router.post("/login", RestritLogin);
router.use(AuthMiddleware);
router.get("/rankings",Ranking);
router.get("/user", AuthenticatedUser);
router.post("/logout", Logout);
router.put("/profile", UpdateProfile);
router.put("/updatepasword", UpdatePassword);

export default router;
 