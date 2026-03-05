import { Request, Response } from "express";
import { onError } from "../utils/on-error";
import { LikeService } from "../services/likes.service";
import { HTTPError } from "../utils/http.error";

export class LikesController {
  public async toggle(req: Request, res: Response): Promise<void> {
    try {
      const usuarioId = req.usuarioLogado?.id;
      if (!usuarioId) {
        throw new HTTPError(401, "Usuário não autenticado");
      }

      const tweetId = req.body?.tweetId;
      if (!tweetId || typeof tweetId !== "string" || !tweetId.trim()) {
        throw new HTTPError(400, "tweetId é obrigatório");
      }

      const service = new LikeService();
      const resultado = await service.toggleFollow({ usuarioId, tweetId: tweetId.trim() });

      res.status(200).json({
        sucesso: true,
        mensagem: resultado,
      });
    } catch (error) {
      onError(error, res);
    }
  }
}
