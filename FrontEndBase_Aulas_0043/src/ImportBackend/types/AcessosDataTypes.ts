/*
interface SISTEMA_PERMISSOES_INTERFACE {
  [key: string]: {
    MODULO: string
    PERMISSOES: {
      [key: string]: string
      // EXCLUIR: string,

    }
  }
}
*/

// TODO - Criar Novo Crud

export interface SISTEMA_PERMISSOES_INTERFACE {

  PEDIDOS: {
    MODULO: string
    PERMISSOES: {
      MANUTENCAO: string
      PESQUISAR_PEDIDOS_OUTROS_REPRESENTANTES: string
    }
  },

  RELATORIOCADASTRO: {
    MODULO: string
    PERMISSOES: {
      ATUALIZACAO: string
    }
  },

  ATUALIZACAOCADASTRO: {
    MODULO: string
    PERMISSOES: {
      PRODUTOR: string
      ACESSO_OUTROS_USUARIOS: string
      EXCLUIR_CADASTRO: string
    }
  },

  GRUPOS: {
    MODULO: string
    PERMISSOES: {
      MANUTENCAO: string
    }
  },

  USUARIOS: {
    MODULO: string
    PERMISSOES: {
      MANUTENCAO: string
    }
  }
}

export const MAXIMO_ERRO_LOGIN: number = 3

export const SISTEMA_PERMISSOES: SISTEMA_PERMISSOES_INTERFACE = {

  PEDIDOS: {
    MODULO: 'Cadastro de Pedidos',
    PERMISSOES: {
      MANUTENCAO: 'Manutenção Cadastro de Pedidos',
      PESQUISAR_PEDIDOS_OUTROS_REPRESENTANTES: 'Pesquisar Outros Representantes'
    }
  },

  RELATORIOCADASTRO: {
    MODULO: 'Relatórios de Cadastros',
    PERMISSOES: {
      ATUALIZACAO: 'Atualização Cadastral Por Propriedade'
    }
  },

  ATUALIZACAOCADASTRO: {
    MODULO: 'Atualização Cadastral / Prospecção',
    PERMISSOES: {
      PRODUTOR: 'Atualizar Cadastro de Produtores',
      ACESSO_OUTROS_USUARIOS: 'Acessar Cadastros de Outros Usuários (Supervisão)',
      EXCLUIR_CADASTRO: 'Permite Excluir Cadastro de Produtores (Supervisão)'
    }
  },

  GRUPOS: {
    MODULO: 'Cadastro de Grupos de Usuários',
    PERMISSOES: {
      MANUTENCAO: 'Manutenção de Grupos'
    }
  },

  USUARIOS: {
    MODULO: 'Cadastro de Usuário',
    PERMISSOES: {
      MANUTENCAO: 'Manutenção de Usuários'
    }
  }
}
