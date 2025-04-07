declare namespace Express {
  interface Request {
    usuarioLogado: {
      id: string;
      nome: string;
      username: string;
      email: string;
    };
  }
}
