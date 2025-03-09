import React, { useState } from 'react'
import { MenuOpcoesInterface } from '../Layout/MenuCls'


export interface LayoutStateInterface {
  opcaoNavegacaoInferior: number
  exibirMenu: boolean
  opcoesMenu: Array<MenuOpcoesInterface>
}

export default function useLayoutState () {

  const [layoutState, setLayoutState] =
    useState<LayoutStateInterface>( {
      opcaoNavegacaoInferior: -1,
      exibirMenu: false,
      opcoesMenu: []
    } )

  return { layoutState, setLayoutState }

}