import React from 'react'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
import MsgErroAplicacao from '../DevComponents/MsgErroAplicacao'

export default function ErroAplicacao () {
  const navigate = useNavigate()
  return (
    <>
      <MsgErroAplicacao titulo='Erro na Aplicacação!' mensagem='Consulte o suporte e forneça detalhes do erro.'>
        <Button variant='contained' onClick={() => navigate( '/' )} sx={{ width: '100%' }}>Reiniciar Aplicação</Button>
      </MsgErroAplicacao>
    </>
  )
}