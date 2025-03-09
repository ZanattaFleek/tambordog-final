import { TipoClienteType } from "../types/ConstantesDataTypes"

export interface UsuarioInterface {
  idUsuario?: number
  login: string
  nome: string
  whatsApp: string
  email: string
  ativo: boolean
  cpfCnpj: string
  nomeERP: string
  idRepresentante: number
  tentativaLogin?: number
  whatsAppConfirmado?: boolean
  emailConfirmado?: boolean
  tipo: TipoClienteType
}

export interface UsuarioCadastradoInterface {
  idUsuario: number
  nome: string
}
export interface UsuarioRepresentanteInterface {
  idRepresentante: number
  nomeERP: string
  perc_desconto_pedido: number
}


