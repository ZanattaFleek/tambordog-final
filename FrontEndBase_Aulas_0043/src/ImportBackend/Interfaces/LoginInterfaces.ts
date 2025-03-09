import { RespostaPadraoInterface } from "./PadraoInterfaces";

export interface UsuarioLogadoInterface {
  ok: boolean
  mensagem: string
  nome: string
  token: string
  idUsuario: number
  idRepresentante: number
  perDescontoMaximo: number
}

export interface LoginInputInterface {
  login?: string
  senha?: string
}

export interface VerificaPermissaoInputInterface {
  token: string
  modulo: string
  permissao: string
}

export interface AcessoTypeInterface extends RespostaPadraoInterface {
  idUsuario: number
}

export interface VersaoTypeInterface {
  desenvolvimento: boolean
  versao: string
}


