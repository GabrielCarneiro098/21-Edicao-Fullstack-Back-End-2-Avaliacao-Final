import { Request, Response } from "express";
import { onError } from "../utils/on-error";
import { AuthService } from "../services/auth.service";

export class AuthController {
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, username, senha } = req.body;

      const service = new AuthService();
      const resultado = await service.loginUsario({ email, username, senha });

      res.status(200).json({
        sucesso: true,
        mensagem: "Login efetuado com sucesso",
        dados: { token: resultado },
      });
    } catch (error) {
      onError(error, res);
    }
  }
  public async logout(req: Request, res: Response): Promise<void> {
    try {
      const service = new AuthService();
      await service.logoutUsuario(req.usuarioLogado.id);

      res.status(200).json({
        sucesso: true,
        mensagem: "Logout efetuado com sucesso",
      });
    } catch (error) {
      onError(error, res);
    }
  }
}
