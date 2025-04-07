export interface CadastrarUsuarioDto {
  nome: string;
  email: string;
  username: string;
  senha: string;
}

export interface ListarUsuariosDto {
  nome?: string;
}

export type AtualizarUsuarioDto = Partial<CadastrarUsuarioDto> & { id: string };
