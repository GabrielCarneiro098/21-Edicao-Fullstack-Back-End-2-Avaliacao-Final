import { Request, Response } from "express";
import { onError } from "../utils/on-error";
import { LikeService } from "../services/likes.service";

export class LikesController {
  public async toggle(req: Request, res: Response): Promise<void> {
    try {
      const usuarioId = req.usuarioLogado.id;

      const { tweetId } = req.body;

      const service = new LikeService();
      const resultado = await service.toggleFollow({ usuarioId, tweetId });
      //Service

      res.status(201).json({
        sucesso: true,
        messagem: resultado,
      });
    } catch (error) {
      onError(error, res);
    }
  }
}
