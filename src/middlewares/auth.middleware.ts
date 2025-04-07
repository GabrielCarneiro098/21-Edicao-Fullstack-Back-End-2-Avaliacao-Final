import { NextFunction, Request, Response } from "express";
import { onError } from "../utils/on-error";
import { prismaClient } from "../database/prisma.client";
import { validate as isValidUid } from "uuid";
import { HTTPError } from "../utils/http.error";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization;

    if (!token) {
      throw new HTTPError(401, "Token de autenticação ausente");
    }

    if (!isValidUid(token)) {
      throw new HTTPError(400, "Token de autenticação inválido");
    }

    const usuarioEncontrado = await prismaClient.usuario.findFirst({
      where: {
        authToken: token,
      },
    });

    if (!usuarioEncontrado) {
      throw new HTTPError(404, "Usuário não encontrado");
    }

    req.usuarioLogado = {
      id: usuarioEncontrado.id,
      nome: usuarioEncontrado.nome,
      username: usuarioEncontrado.username,
      email: usuarioEncontrado.email,
    };

    next();
  } catch (error) {
    onError(error, res);
  }
}
