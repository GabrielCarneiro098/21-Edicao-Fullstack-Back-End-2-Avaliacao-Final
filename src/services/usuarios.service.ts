import { Usuario } from "@prisma/client";
import { prismaClient } from "../database/prisma.client";
import { CadastrarUsuarioDto } from "../dtos/usuarios.dto";
import bcrypt from "bcrypt";
import { HTTPError } from "../utils/http.error";

const salRountds = 10;

type UsuarioParcial = Omit<Usuario, "senha" | "email" | "authToken">;

export class UsuariosService {
  public async listar(): Promise<UsuarioParcial[]> {
    const usuariosDB = await prismaClient.usuario.findMany({
      omit: {
        email: true,
        senha: true,
        authToken: true,
      },
    });

    return usuariosDB;
  }

  public async cadastrar({
    email,
    nome,
    username,
    senha,
  }: CadastrarUsuarioDto): Promise<UsuarioParcial> {
    const emailExistente = await prismaClient.usuario.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    const usernameExistente = await prismaClient.usuario.findUnique({
      where: { username: username.toLowerCase() },
    });

    if (emailExistente) {
      throw new HTTPError(409, "Email já cadastrado");
    }

    if (usernameExistente) {
      throw new HTTPError(409, "Nome de usuário já está em uso");
    }

    const novoUsuario = await prismaClient.usuario.create({
      data: {
        nome,
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        senha: await bcrypt.hash(senha, salRountds),
      },
      omit: { ["senha"]: true, ["email"]: true },
    });

    return novoUsuario;
  }

  public async buscar(id: string): Promise<UsuarioParcial | null> {
    // Verifica se o usuário existe
    const usuarioExistente = await prismaClient.usuario.findUnique({
      where: { id },
    });
    if (!usuarioExistente) {
      throw new HTTPError(404, "Usuário não encontrado");
    }

    const usuario = await prismaClient.usuario.findUnique({
      where: { id },
      omit: { ["senha"]: true, ["email"]: true },
    });

    return usuario;
  }

  public async atualizar({
    id,
    nome,
    email,
    username,
    senhaNova,
    senhaAtual,
  }: any): Promise<UsuarioParcial | null> {
    // Buscar o usuário
    const usuario = await prismaClient.usuario.findUnique({ where: { id } });

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    const dadosAtualizados: any = {
      nome,
      email,
      username,
    };

    // Se senhaNova foi informada, senhaAtual também deve ser validada
    if (senhaNova) {
      if (!senhaAtual) {
        throw new Error(
          "Para alterar a senha, é necessário informar a senha atual"
        );
      }

      const senhaConfere = await bcrypt.compare(senhaAtual, usuario.senha);
      if (!senhaConfere) {
        throw new Error("Senha atual incorreta");
      }

      // Gerar hash da nova senha
      const novaSenhaHash = await bcrypt.hash(senhaNova, 10);
      dadosAtualizados.senha = novaSenhaHash;
    }

    // Atualizar o usuário
    const usuarioAtualizado = await prismaClient.usuario.update({
      where: { id },
      data: dadosAtualizados,
      omit: { senha: true, email: true, authToken: true },
    });

    return usuarioAtualizado;
  }

  public async deletar(
    id: string,
    senha: string
  ): Promise<UsuarioParcial | null> {
    const usuario = await prismaClient.usuario.findUnique({
      where: { id },
    });

    if (!senha) {
      throw new Error("Senha não informada");
    }

    // Verificar se a senha informada confere com a senha do usuário
    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    const senhaConfere = await bcrypt.compare(senha, usuario.senha);

    if (!senhaConfere) {
      throw new Error("Senha incorreta");
    }
    // Deletar o usuário

    const usuarioDeletado = await prismaClient.usuario.delete({
      where: { id },
      omit: { senha: true, email: true, authToken: true },
    });

    return usuarioDeletado;
  }
}
