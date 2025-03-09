import { NavigateFunction } from "react-router-dom"
import { LayoutStateInterface } from "../../GlobalStates/LayoutState"
import { LoginStateInterface } from "../../GlobalStates/LoginState"

export class ClsLogout {

  public efetuarLogout (
    setLoginState: React.Dispatch<React.SetStateAction<LoginStateInterface>>,
    setLayoutState: React.Dispatch<React.SetStateAction<LayoutStateInterface>>,
    navigate: NavigateFunction
  ) {

    localStorage.removeItem( 'token' )

    // TODO - ACRESCENTAR PROPRIEDADE LOGIN STATE
    // Reset LoginState
    setLoginState( {
      logado: false,
      idUsuario: 0,
      permissoes: [],
      token: '',
      nome: '',
      idRepresentante: 0,
      perDescontoMaximo: 0
    } )

    // Reset LayoutState
    setLayoutState( {
      exibirMenu: false,
      opcoesMenu: [],
      opcaoNavegacaoInferior: -1
    } )

    navigate( '/' )
  }
}