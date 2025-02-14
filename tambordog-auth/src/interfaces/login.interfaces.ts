import { PermissoesTypesInterface } from "../types/PermissoesTypes"

export interface LoginInterface {
   token: string
   permissoes: PermissoesTypesInterface
   perfil: 'A' | 'U'
   nome: string
}