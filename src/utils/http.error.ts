export class HTTPError extends Error {
  constructor(public statusCode: number, mensagemErro: string) {
    super(mensagemErro);
  }
}
