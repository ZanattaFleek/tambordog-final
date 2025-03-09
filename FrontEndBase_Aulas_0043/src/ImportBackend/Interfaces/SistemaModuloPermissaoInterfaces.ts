export interface SistemaModuloPermissaoInterface {
  idSistemaPermissao: number
  idModulo: number
  descricao: string
}

export interface QuerySistemaModuloPermissaoInterface {
  idSistemaPermissao: number
  idModulo: number
  descricao: string
  permitido: boolean
}

export interface SistemaModuloInterface {
  idModulo: number
  descricao: string
}

export interface PermissoesInterface {
  modulo: string
  permissao: string
}

