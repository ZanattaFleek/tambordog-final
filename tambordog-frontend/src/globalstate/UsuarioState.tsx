import React, { useState } from "react"
import { LoginInterface } from "../../../tambordog-auth/src/interfaces/login.interfaces"
import { PermissoesTypes } from "../backendImports/types/PermissoesTypes"

export interface UsuarioStateInterface extends LoginInterface {
  logado: boolean
}

export function useUsuarioState() {
  const [usuarioState, setUsuarioState] = useState<UsuarioStateInterface>({
    logado: true,
    nome: "",
    perfil: "U",
    permissoes: PermissoesTypes,
    token: ""
  })

  return { usuarioState, setUsuarioState }
}
