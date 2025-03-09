import React, { useContext } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import { Box, Link, Typography } from '@mui/material'
import { ContextoGlobal, ContextoGlobalInterface } from '../GlobalStates/ContextoGlobal'
import { EMDESENVOLVIMENTO } from '../ImportBackend/Config/emDesenvolvimento'

import { styled } from '@mui/material/styles';
import Condicional from './Condicional'
import NavegacaoInferior from './NavegacaoInferior'

export default function BottomBar () {

  const Offset = styled( 'div' )( ( { theme } ) => theme.mixins.toolbar );

  const contexto: ContextoGlobalInterface = useContext( ContextoGlobal ) as ContextoGlobalInterface

  return (
    <>
      <Offset />
      <AppBar sx={{ top: 'auto', bottom: 0, maxHeight: '40px' }}>
        <Toolbar>
          <NavegacaoInferior></NavegacaoInferior>

          <Box sx={{ flexGrow: 1 }} >

            <Condicional condicao={EMDESENVOLVIMENTO}>
              <Typography variant="body2" component="div" sx={{ marginBottom: 2 }}>
                {contexto.loginState.token}
              </Typography>
            </Condicional>

            <Condicional condicao={!EMDESENVOLVIMENTO}>

              <Typography variant="body2" color="white" align="center">
                {'Copyright © '}
                <Link color="inherit" href="https://www.cooperbom.com.br">
                  Cooperbom
                </Link>
                {' '}
                {new Date().getFullYear()}
                {'.'}
              </Typography>

            </Condicional>
          </Box>

          <Box sx={{ flexGrow: 0, mr: 1, textAlign: 'right' }} >
            <Condicional condicao={contexto.loginState.logado}>
              <Typography variant="body2" component="div" sx={{ marginBottom: 2, textAlign: 'right' }}>
                {contexto.loginState.nome}
              </Typography>
            </Condicional>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  )
}