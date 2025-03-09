import React, { useState } from 'react'
import { AlertColor } from '@mui/material'

export enum MensagemTipo {
  Warning = 'warning',
  Error = 'error',
  Info = 'info',
  Sucesso = 'success',
  Loading = 'Loading'
}

export interface MensagemStateInterface {
  exibir: boolean
  titulo: string
  mensagem: string
  tipo: AlertColor | 'Loading'
  exibirBotao: boolean | 'SN' | string
  cb: null | ( ( res: boolean ) => void )
}

export const MensagemStatePadrao: MensagemStateInterface = {
  exibir: false,
  titulo: '',
  mensagem: '',
  tipo: MensagemTipo.Info,
  exibirBotao: 'SN',
  cb: () => {}
}

export default function useMensagemState () {

  const [mensagemState, setMensagemState] =
    useState<MensagemStateInterface>( MensagemStatePadrao )

  return { mensagemState, setMensagemState }

}