import { Router } from "express";
import { UsuariosController } from "../controllers/usuarios.controller";
import { TweetsController } from "../controllers/tweets.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export class UsuariosRoutes {
  public static bind(): Router {
    const router = Router();

    const controller = new UsuariosController();
    const controllerTweets = new TweetsController();

    // Rotas publicas, não precisam de autenticação
    router.get("/usuarios", controller.listar); //Listar usuários
    router.get("/usuarios/:id", controller.buscar); //Listar usuário por ID
    router.post("/usuarios", controller.cadastrar); //Cadastrar usuários

    // Rotas privadas, necessário autenticação
    router.put("/usuarios", [authMiddleware], controller.atualizar); //Cadastrar usuários
    router.delete("/usuarios", [authMiddleware], controller.deletar); //Cadastrar usuários

    router.post(
      "/usuarios/tweet",
      [authMiddleware],
      controllerTweets.cadastrar
    );
    router.put("/usuarios/tweet", [authMiddleware], controllerTweets.atualizar);
    return router;
  }
}
