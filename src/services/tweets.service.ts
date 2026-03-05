import { Tweet } from "@prisma/client";
import { prismaClient } from "../database/prisma.client";
import { HTTPError } from "../utils/http.error";

export type TweetComContagem = Tweet & {
  _count: { likes: number; respostas: number };
  liked?: boolean;
};

export class TweetsService {
  public async listar(usuarioId?: string): Promise<TweetComContagem[]> {
    const tweets = await prismaClient.tweet.findMany({
      include: {
        _count: {
          select: { likes: true, respostas: true },
        },
      },
    });

    const resultado: TweetComContagem[] = tweets.map((t) => ({
      ...t,
      _count: (t as Tweet & { _count: { likes: number; respostas: number } })._count,
      liked: false,
    }));

    if (usuarioId) {
      const tweetIds = resultado.map((t) => t.id);
      const likesDoUsuario = await prismaClient.like.findMany({
        where: { usuarioId, tweetId: { in: tweetIds } },
        select: { tweetId: true },
      });
      const setLiked = new Set(likesDoUsuario.map((l) => l.tweetId));
      resultado.forEach((t) => {
        t.liked = setLiked.has(t.id);
      });
    }

    return resultado;
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
