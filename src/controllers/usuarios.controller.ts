import { Request, Response } from "express";
import { onError } from "../utils/on-error";
import { prismaClient } from "../database/prisma.client";
import bcrypt from "bcrypt";
import { UsuariosService } from "../services/usuarios.service";
const salRountds = 10;

export class UsuariosController {
  // Listar usuários
  public async listar(req: Request, res: Response): Promise<void> {
    try {
      const service = new UsuariosService();

      const dados = await service.listar();

      res.status(200).json({
        sucesso: true,
        mensagem: "Usuários encontrados",
        resultado: dados,
      });
    } catch (error) {
      onError(error, res);
    }
  }

  // Listar usuário por ID
  public async buscar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const service = new UsuariosService();

      const usuario = await service.buscar(id);

      if (!usuario) {
        res.status(404).json({
          sucesso: false,
          mensagem: "Usuário não encontrado",
        });
        return;
      }

      res.status(200).json({
        sucesso: true,
        mensagem: "Usuário encontrado",
        resultado: usuario,
      });
    } catch (error) {
      onError(error, res);
    }
  }

  // Cadastrar usuário
  public async cadastrar(req: Request, res: Response): Promise<void> {
    try {
      const { nome, email, username, senha } = req.body;

      if (!nome || !email || !username || !senha) {
        res.status(400).json({
          sucesso: false,
          mensagem: "Preencha todos os campos obrigatórios",
        });
        return;
      }

      const service = new UsuariosService();

      const resultado = await service.cadastrar({
        nome,
        email,
        username,
        senha,
      });

      res.status(201).json({
        sucesso: true,
        mensagem: "Novo usuário cadastrado",
        dados: resultado,
      });
    } catch (error) {
      // onError(error, res);

      res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao cadastrar usuário",
        detalhe: (error as Error).message,
      });
    }
  }

  // Atualizar usuário
  public async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const { nome, email, username, senhaNova, senhaAtual } = req.body;

      const service = new UsuariosService();
      const resultado = await service.atualizar({
        id: req.usuarioLogado.id,
        nome,
        email,
        username,
        senhaNova,
        senhaAtual,
      });

      res.status(200).json({
        sucesso: true,
        mensagem: "Usuário atualizado com sucesso",
        resultado: resultado,
      });
    } catch (error) {
      onError(error, res);
    }
  }

  // Deletar usuário
  public async deletar(req: Request, res: Response): Promise<void> {
    try {
      const senha = req.body.senha;
      const service = new UsuariosService();
      await service.deletar(req.usuarioLogado.id, senha);

      res.status(200).json({
        sucesso: true,
        mensagem: "Usuário deletado com sucesso",
      });
    } catch (error) {
      onError(error, res);
    }
  }
}
