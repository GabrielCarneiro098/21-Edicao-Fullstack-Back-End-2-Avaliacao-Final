import { prismaClient } from "../database/prisma.client";
import { LoginDTO } from "../dtos/auth.dto";
import { HTTPError } from "../utils/http.error";
import bcrypt from "bcrypt";
import { v4 as randomUUID } from "uuid";

export class AuthService {
  public async loginUsuario({ login, senha }: LoginDTO): Promise<string> {
    try {
      if (!senha || !login) {
        throw new HTTPError(400, "Login e senha são obrigatórios");
      }

      const isEmail = login.includes("@");

      const whereCondition = isEmail ? { email: login } : { username: login };

      const usuario = await prismaClient.usuario.findFirst({
        where: whereCondition,
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
