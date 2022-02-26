import { Router } from "express";
import {
  Login,
  Register,
  AuthenticatedUser,
  Logout,
  UpdateProfile,
  UpdatePassword,
} from "../controllers/auth.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

import {Ambassadors} from "../controllers/user.controller";
const router = Router();

router.post("/register", Register);
router.post("/login", Login);
router.use(AuthMiddleware);
router.get("/user", AuthenticatedUser);
router.post("/logout", Logout);
router.put("/profile", UpdateProfile);
router.put("/updatepasword", UpdatePassword).get("/ambassadors",Ambassadors)

export default router;
