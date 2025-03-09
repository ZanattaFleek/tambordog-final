import { ApolloClient } from '@apollo/client'
import React, { createContext } from 'react'
import { LayoutStateInterface } from '../GlobalStates/LayoutState'
import { LoginStateInterface } from './LoginState'
import { MensagemStateInterface } from './MensagemState'

export interface ContextoGlobalInterface {
  layoutState: LayoutStateInterface
  setLayoutState: React.Dispatch<React.SetStateAction<LayoutStateInterface>>,
  mensagemState: MensagemStateInterface
  setMensagemState: React.Dispatch<React.SetStateAction<MensagemStateInterface>>,
  loginState: LoginStateInterface,
  setLoginState: React.Dispatch<React.SetStateAction<LoginStateInterface>>,
  apolloClient: ApolloClient<object>
}

export const ContextoGlobal = createContext<ContextoGlobalInterface | null>( null )
