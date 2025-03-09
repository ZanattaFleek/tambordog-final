import { PermissoesInterface } from "../ImportBackend/Interfaces/SistemaModuloPermissaoInterfaces"
import { SISTEMA_PERMISSOES } from "../ImportBackend/types/AcessosDataTypes"
import ClsAcesso from "../Utils/ClsAcesso"

export interface MenuOpcoesInterface {
  descricao: string
  path: string
  icon: string
  filhos: Array<MenuOpcoesInterface>
  modulo: string
  permissao: string
}

const MENU: Array<MenuOpcoesInterface> = [
  {
    descricao: 'Pedidos',
    path: '',
    icon: 'app_registration_outlined',
    modulo: '',
    permissao: '',
    filhos: [
      {
        descricao: 'Pedido',
        path: '/Pedidos',
        icon: 'shopping_cart_outlined',
        filhos: [],
        modulo: SISTEMA_PERMISSOES.PEDIDOS.MODULO,
        permissao: SISTEMA_PERMISSOES.PEDIDOS.PERMISSOES.MANUTENCAO
      }
    ]
  },
  {
    descricao: 'Cadastros',
    path: '',
    icon: 'app_registration_outlined',
    modulo: '',
    permissao: '',
    filhos: [
      {
        descricao: 'Atualização Cadastro Produtor',
        path: '/AtualizarCadastroProdutor',
        icon: 'edit_outlined',
        filhos: [],
        modulo: SISTEMA_PERMISSOES.ATUALIZACAOCADASTRO.MODULO,
        permissao: SISTEMA_PERMISSOES.ATUALIZACAOCADASTRO.PERMISSOES.PRODUTOR
      },
      {
        descricao: 'Relatórios de Cadastros',
        path: '/RelatorioAtualizacao',
        icon: 'feed_outlined',
        filhos: [],
        modulo: SISTEMA_PERMISSOES.RELATORIOCADASTRO.MODULO,
        permissao: SISTEMA_PERMISSOES.RELATORIOCADASTRO.PERMISSOES.ATUALIZACAO
      },

      /*
      {
        descricao: 'Clientes',
        path: '/Clientes',
        icon: 'person_outline_outlined',
        filhos: [],
        modulo: SISTEMA_PERMISSOES.CLIENTES.MODULO,
        permissao: SISTEMA_PERMISSOES.CLIENTES.PERMISSOES.MANUTENCAO
      },
      {
        descricao: 'Equipamentos',
        path: '/Equipamentos',
        icon: 'person_outline_outlined',
        filhos: [],
        modulo: SISTEMA_PERMISSOES.CLIENTES.MODULO,
        permissao: SISTEMA_PERMISSOES.CLIENTES.PERMISSOES.MANUTENCAO
      },
      {
        descricao: 'Perfis',
        path: '/Perfis',
        icon: 'person_outline_outlined',
        filhos: [],
        modulo: SISTEMA_PERMISSOES.PERFIS.MODULO,
        permissao: SISTEMA_PERMISSOES.PERFIS.PERMISSOES.MANUTENCAO
      },
      {
        descricao: 'Parametros',
        path: '/Parametros',
        icon: 'person_outline_outlined',
        filhos: [],
        modulo: SISTEMA_PERMISSOES.PARAMETROS.MODULO,
        permissao: SISTEMA_PERMISSOES.PARAMETROS.PERMISSOES.MANUTENCAO
      }
      */
    ]
  },
  {
    descricao: 'Sistema',
    path: '',
    icon: 'app_registration_outlined',
    modulo: '',
    permissao: '',
    filhos: [
      {
        descricao: 'Grupos de Usuários',
        path: '/Grupos',
        icon: 'people_alt_outlined',
        filhos: [],
        modulo: SISTEMA_PERMISSOES.GRUPOS.MODULO,
        permissao: SISTEMA_PERMISSOES.GRUPOS.PERMISSOES.MANUTENCAO
      },
      {
        descricao: 'Usuários',
        path: '/Usuarios',
        icon: 'person_outline_outlined',
        filhos: [],
        modulo: SISTEMA_PERMISSOES.USUARIOS.MODULO,
        permissao: SISTEMA_PERMISSOES.USUARIOS.PERMISSOES.MANUTENCAO
      }
    ]
  }
]

export default class ClsMenu {

  private retornoMenu: Array<MenuOpcoesInterface> = []

  public constructor( private Permissoes: Array<PermissoesInterface> = [] ) {
    this.retornoMenu = this.limparMenuSemFilhos( this.tratarPermissoes( MENU ) )
  }

  private limparMenuSemFilhos ( menu: Array<MenuOpcoesInterface> ): Array<MenuOpcoesInterface> {
    let retorno: Array<MenuOpcoesInterface> = []

    menu.forEach( ( v ) => {
      if (
        ( v.modulo
          && v.modulo.length > 0
          && v.permissao
          && v.permissao.length > 0 )
        || ( v.modulo
          && v.modulo.length > 0 )
        || ( !v.modulo && !v.permissao )
      ) {
        if ( v.filhos && v.filhos.length > 0 ) {
          v.filhos = this.limparMenuSemFilhos( v.filhos )
        }

        if ( ( v.filhos && v.filhos.length > 0 )
          || v.path.length > 0
        )
          retorno.push( v )
      }
    } )

    return retorno


  }
  private tratarPermissoes ( menu: Array<MenuOpcoesInterface> ): Array<MenuOpcoesInterface> {

    let retorno: Array<MenuOpcoesInterface> = []
    let clsAcesso = new ClsAcesso()

    menu.forEach( ( v ) => {
      if (
        ( v.modulo
          && v.modulo.length > 0
          && v.permissao
          && v.permissao.length > 0
          && clsAcesso.chkAcesso( this.Permissoes, v.modulo, v.permissao ) )
        || ( v.modulo
          && v.modulo.length > 0
          && clsAcesso.chkAcessoModulo( this.Permissoes, v.modulo ) )
        || ( !v.modulo && !v.permissao )
      ) {
        if ( v.filhos && v.filhos.length > 0 ) {
          v.filhos = this.tratarPermissoes( v.filhos )
        }
        retorno.push( v )
      }
    } )

    return retorno

  }

  public get MenuOpcoes (): Array<MenuOpcoesInterface> {
    return this.retornoMenu
  }

}