import { Router } from "express";
import { LikesController } from "../controllers/likes.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export class LikesRoutes {
  public static bind(): Router {
    const router = Router();
    const controller = new LikesController();

    router.patch("/like", [authMiddleware], controller.toggle);
    return router;
  }
}
