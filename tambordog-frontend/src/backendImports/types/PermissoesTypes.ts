export interface PermissoesTypesInterface {

    SOMATORIA: {
        MODULO: string
        PERMISSOES: {
            SOMAR: string
        }
    },

    ATLETA: {
        MODULO: string
        PERMISSOES: {
            MANUTENCAO: string
        }
    },
}

export const PermissoesTypes: PermissoesTypesInterface = {

    SOMATORIA: {
        MODULO: 'Somatória',
        PERMISSOES: {
            SOMAR: 'Somar'
        }
    },

    ATLETA: {
        MODULO: 'Cadastro de Atletas',
        PERMISSOES: {
            MANUTENCAO: 'Manutenção de Cadastro de Atleta'
        }
    },

}
