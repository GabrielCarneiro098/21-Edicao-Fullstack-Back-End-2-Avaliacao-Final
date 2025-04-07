import { error } from "console";
import { toogleFollowDto } from "../dtos/follow.dto";
import { HTTPError } from "../utils/http.error";
import { prismaClient } from "../database/prisma.client";

export class FollowService {
  public async toggleFollow({
    usuarioId,
    followerId,
  }: toogleFollowDto): Promise<string> {
    if (usuarioId === followerId) {
      throw new HTTPError(409, "Usuário não pode seguir ele mesmo.");
    }

    const registroExiste = await prismaClient.follow.findUnique({
      where: {
        usuarioId_followerId: {
          usuarioId,
          followerId,
        },
      },
    });

    if (registroExiste) {
      const registroFollow = await prismaClient.follow.delete({
        where: {
          usuarioId_followerId: {
            usuarioId,
            followerId,
          },
        },
        include: { usuario: true, follower: true },
      });

      return `Usuario ${registroFollow.follower.username} deixou de seguir ${registroFollow.usuario.username}`;
    }

    const registroFollow = await prismaClient.follow.create({
      data: {
        followerId,
        usuarioId,
      },
      include: {
        usuario: true,
        follower: true,
      },
    });

    return `Usuario ${registroFollow.follower.username} agora segue ${registroFollow.usuario.username}`;
  }
}
