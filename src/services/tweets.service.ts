import { Tweet } from "@prisma/client";
import { prismaClient } from "../database/prisma.client"; // Verifique o caminho correto aqui
import { HTTPError } from "../utils/http.error";

export class TweetsService {
  public async listar(): Promise<Tweet[]> {
    // Use Tweet[] here
    const tweets = await prismaClient.tweet.findMany(); // `tweet` deve ser em minúsculo se corresponder ao seu esquema no Prisma

    return tweets;
  }

  public async cadastrar({
    usuarioId,
    conteudo,
  }: {
    usuarioId: string;
    conteudo: string;
  }): Promise<Tweet> {
    // Use Tweet aqui

    if (!conteudo) {
      throw new Error("Preencha todos os campos obrigatórios");
    }

    const novoTweet = await prismaClient.tweet.create({
      data: { usuarioId, conteudo },
    });

    return novoTweet; // Retorna o novo tweet criado
  }

  public async responderTweet({
    tweetId,
    conteudo,
    usuarioId,
  }: {
    tweetId: string;
    conteudo: string;
    usuarioId: string;
  }): Promise<void> {
    if (!conteudo) {
      throw new HTTPError(400, "Conteúdo da resposta é obrigatório");
    }

    const tweetOriginal = await prismaClient.tweet.findUnique({
      where: { id: tweetId },
    });

    if (!tweetOriginal) {
      throw new HTTPError(404, "Tweet original não encontrado");
    }

    await prismaClient.tweet.create({
      data: {
        conteudo,
        tipo: "REPLY",
        usuarioId,
        reply: tweetId, // link para o tweet original
      },
    });
  }

  public async atualizar({
    usuarioId,
    tweetId,
    conteudo,
  }: {
    usuarioId: string;
    tweetId: string;
    conteudo: string;
  }): Promise<Tweet> {
    if (!tweetId) {
      throw new Error("Tweet não encontrado");
    }

    if (!conteudo) {
      throw new Error("Preencha todos os campos obrigatórios");
    }

    const tweetExistente = await prismaClient.tweet.findUnique({
      where: { id: tweetId, usuarioId: usuarioId },
    });

    if (!tweetExistente) {
      throw new Error("Tweet não encontrado ou não pertence ao usuário.");
    }

    const tweetAtualizado = await prismaClient.tweet.update({
      where: { id: tweetId },
      data: { conteudo },
    });

    return tweetAtualizado; // Retorna o tweet atualizado
  }

  public async deletar({
    usuarioId,
    tweetId,
  }: {
    usuarioId: string;
    tweetId: string;
  }) {
    if (!tweetId) {
      throw new Error("Tweet não encontrado");
    }

    const tweetExistente = await prismaClient.tweet.findUnique({
      where: { id: tweetId, usuarioId: usuarioId },
    });

    if (!tweetExistente || tweetExistente.usuarioId !== usuarioId) {
      throw new Error("Tweet não encontrado ou não pertence ao usuário");
    }

    const tweetDeletado = await prismaClient.tweet.delete({
      where: { id: tweetId },
    });

    return tweetDeletado;
  }
}
