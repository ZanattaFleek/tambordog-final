export interface GrupoInterface {
    idGrupo?: string
    nome: string
}

export interface GrupoUsuarioInterface {
    idGrupo: string
    idUsuario: string
}

export interface GrupoPermissaoInterface {
    idGrupoPermissao: string
    idGrupo: string
    idModuloPermissao: string
}
