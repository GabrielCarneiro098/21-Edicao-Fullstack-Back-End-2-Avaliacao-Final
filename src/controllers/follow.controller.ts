import { Request, Response } from "express";
import { onError } from "../utils/on-error";
import { FollowService } from "../services/follow.service";

export class FollowController {
  public async toggle(req: Request, res: Response): Promise<void> {
    try {
      const followerId = req.usuarioLogado.id;

      const { usuarioId } = req.body;

      const service = new FollowService();
      const resultado = await service.toggleFollow({ followerId, usuarioId });
      //Service

      res.status(200).json({
        sucesso: true,
        mensagem: resultado,
      });
    } catch (error) {
      onError(error, res);
    }
  }
}
