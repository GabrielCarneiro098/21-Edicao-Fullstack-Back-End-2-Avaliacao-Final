import { Router } from "express";
import { TweetsController } from "../controllers/tweets.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export class TweetsRoutes {
  public static bind(): Router {
    const router = Router();

    const controller = new TweetsController();

    router.get("/tweets", controller.listar); //Listar tweets
    router.post("/tweets", [authMiddleware], controller.cadastrar); //Cadastrar tweets
    router.put("/tweets/:id", [authMiddleware], controller.atualizar); //Atualizar um tweet
    router.delete("/tweets/:id", [authMiddleware], controller.deletar); //Atualizar um tweet
    router.post(
      "/tweets/:id/reply",
      [authMiddleware],
      controller.responder.bind(controller)
    ); //Responde a um tweet

    return router;
  }
}
