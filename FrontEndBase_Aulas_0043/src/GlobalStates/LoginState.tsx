import React, { useState } from 'react'
import { PermissoesInterface } from '../ImportBackend/Interfaces/SistemaModuloPermissaoInterfaces'

// TODO - ACRESCENTAR PROPRIEDADE LOGIN STATE
export interface LoginStateInterface {
  token: string
  nome: string
  logado: boolean
  idUsuario: number
  idRepresentante: number
  perDescontoMaximo: number
  permissoes: Array<PermissoesInterface>
}

export default function useLoginState () {

  // TODO - ACRESCENTAR PROPRIEDADE LOGIN STATE
  const [loginState, setLoginState] =
    useState<LoginStateInterface>( {
      token: '',
      nome: '',
      idUsuario: 0,
      logado: false,
      idRepresentante: 0,
      perDescontoMaximo: 0,
      permissoes: []
    } )

  return { loginState, setLoginState }

}