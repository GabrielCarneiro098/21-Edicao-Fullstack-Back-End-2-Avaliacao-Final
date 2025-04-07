import { Request, Response } from "express";
import { onError } from "../utils/on-error";
import { prismaClient } from "../database/prisma.client";
import { TweetsService } from "../services/tweets.service";

export class TweetsController {
  public async listar(req: Request, res: Response): Promise<void> {
    try {
      const service = new TweetsService();

      const dados = await service.listar();

      // const dados = await prismaClient.tweet.findMany();

      res.status(200).json({
        sucesso: true,
        mensagem: "Tweets encontrados",
        resultado: dados,
      });
    } catch (error) {
      onError(error, res);
    }
  }

  public async cadastrar(req: Request, res: Response): Promise<void> {
    try {
      const usuarioLogado = req.usuarioLogado;
      const conteudo = req.body.conteudo;

      const service = new TweetsService();
      const dados = await service.cadastrar({
        usuarioId: usuarioLogado.id,
        conteudo,
      });

      res.status(201).json({
        sucesso: true,
        mensagem: "Novo tweet cadastrado",
        resultado: dados,
      });
    } catch (error) {
      onError(error, res);
    }
  }

  public async responder(req: Request, res: Response): Promise<void> {
    try {
      const tweetId = req.params.id;
      const { conteudo } = req.body;
      const usuario = req.usuarioLogado;

      const service = new TweetsService();
      await service.responderTweet({
        tweetId,
        conteudo,
        usuarioId: usuario.id,
      });

      res.status(201).json({
        sucesso: true,
        mensagem: "Reply cadastrada com sucesso",
      });
    } catch (error) {
      onError(error, res);
    }
  }

  public async atualizar(req: Request, res: Response) {
    try {
      const usuarioLogado = req.usuarioLogado;
      const novoConteudo = req.body.conteudo;
      const tweetId = req.params.id;

      const service = new TweetsService();
      const dados = await service.atualizar({
        usuarioId: usuarioLogado.id,
        tweetId: tweetId,
        conteudo: novoConteudo,
      });

      res.status(200).json({
        sucesso: true,
        mensagem: "Tweet atualizado com sucesso",
        resultado: dados,
      });
    } catch (error) {
      onError(error, res);
    }
  }

  public async deletar(req: Request, res: Response) {
    try {
      const usuarioLogado = req.usuarioLogado;
      const tweetId = req.params.id;
      console.log(usuarioLogado, tweetId);
      const service = new TweetsService();
      const dados = await service.deletar({
        usuarioId: usuarioLogado.id,
        tweetId: tweetId,
      });

      res.status(200).json({
        sucesso: true,
        mensagem: "Tweet deletado com sucesso",
        resultado: dados,
      });
    } catch (error) {
      onError(error, res);
    }
  }
}
