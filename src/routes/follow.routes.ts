import { Router } from "express";
import { FollowController } from "../controllers/follow.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export class FollowRoutes {
  public static bind(): Router {
    const router = Router();
    const controller = new FollowController();

    router.patch("/follow", [authMiddleware], controller.toggle);
    return router;
  }
}
