import { error } from "console";
import { toogleLikeDto } from "../dtos/like.dto";
import { HTTPError } from "../utils/http.error";
import { prismaClient } from "../database/prisma.client";

export class LikeService {
  public async toggleFollow({
    usuarioId,
    tweetId,
  }: toogleLikeDto): Promise<string> {
    const registroExiste = await prismaClient.like.findUnique({
      where: {
        usuarioId_tweetId: {
          usuarioId,
          tweetId,
        },
      },
    });

    if (registroExiste) {
      const registroFollow = await prismaClient.like.delete({
        where: {
          usuarioId_tweetId: {
            usuarioId,
            tweetId,
          },
        },
        include: { usuario: true, tweet: true },
      });

      return `Usuario ${registroFollow.usuario.username} removeu like de '${registroFollow.tweet.conteudo}'`;
    }

    const registroFollow = await prismaClient.like.create({
      data: {
        usuarioId,
        tweetId,
      },
      include: {
        usuario: true,
        tweet: true,
      },
    });

    return `Usuario ${registroFollow.usuario.username} deu like em '${registroFollow.tweet.conteudo}'`;
  }
}
