import { Router } from "express";
import { AuthController } from "../controllers/Auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export class AuthRoutes {
  public static bind(): Router {
    const router = Router();

    const controller = new AuthController();

    router.post("/login", controller.login);
    router.post("/logout", [authMiddleware], controller.logout);

    return router;
  }
}
