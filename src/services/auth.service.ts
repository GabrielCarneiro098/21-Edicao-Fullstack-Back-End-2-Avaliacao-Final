import { prismaClient } from "../database/prisma.client";
import { loginDTO } from "../dtos/auth.dto";
import { HTTPError } from "../utils/http.error";
import bcrypt from "bcrypt";
import { v4 as randomUUID } from "uuid";

export class AuthService {
  public async loginUsario({
    email,
    username,
    senha,
  }: loginDTO): Promise<string> {
    try {
      if (!senha || (!email && !username)) {
        throw new HTTPError(400, "Email ou username e senha são obrigatórios");
      }

      const orConditions = [];
      if (email) orConditions.push({ email });
      if (username) orConditions.push({ username });

      const usuario = await prismaClient.usuario.findFirst({
        where: {
          OR: orConditions,
        },
      });

      if (!usuario) {
        throw new HTTPError(401, "Usuário ou senha inválidos");
      }

      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
      if (!senhaCorreta) {
        throw new HTTPError(401, "Usuário ou senha inválidos");
      }

      const token = randomUUID();

      await prismaClient.usuario.update({
        where: { id: usuario.id },
        data: { authToken: token },
      });

      return token;
    } catch (error) {
      if (error instanceof HTTPError) throw error;
      throw new Error("Login failed");
    }
  }

  public async logoutUsuario(usuarioId: string): Promise<void> {
    try {
      const usuarioEncontrado = await prismaClient.usuario.update({
        where: { id: usuarioId },
        data: { authToken: null },
      });
    } catch (error) {
      throw new Error("Erro inesperado");
    }
  }
}
