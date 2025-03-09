import React, { useEffect, useContext } from 'react'

import { Box, Grid, Paper, Typography } from '@mui/material'
import { EMDESENVOLVIMENTO, VERSAO_SISTEMA } from '../../ImportBackend/Config/emDesenvolvimento'
import BackEndAPI from '../../Services/BackEndAPI'
import { RespostaPadraoInterface } from '../../ImportBackend/Interfaces/PadraoInterfaces'
import { ContextoGlobal, ContextoGlobalInterface } from '../../GlobalStates/ContextoGlobal'
import { useNavigate } from 'react-router-dom'
import { MensagemTipo } from '../../GlobalStates/MensagemState'
import { ClsLogout } from './LogoutCls'

export default function Logout () {

  const navigate = useNavigate()
  const contextoGlobal = useContext( ContextoGlobal ) as ContextoGlobalInterface
  const { mensagemState, setMensagemState } = ( useContext( ContextoGlobal ) as ContextoGlobalInterface )
  const { setLoginState } = ( useContext( ContextoGlobal ) as ContextoGlobalInterface )
  const { setLayoutState } = ( useContext( ContextoGlobal ) as ContextoGlobalInterface )

  const clsApi = new BackEndAPI()

  const abortController: AbortController = new AbortController()

  useEffect( () => {

    const mutation: string = `
      logout {
        ok
        mensagem
      }
    `

    clsApi.mutation<RespostaPadraoInterface>( mutation, 'logout', 'Saindo do Sistema...', contextoGlobal, abortController ).then( rs => {

      if ( rs.ok ) {

        ( new ClsLogout() ).efetuarLogout( setLoginState, setLayoutState, navigate )

      }

    } ).catch( () => {

      setMensagemState( {
        ...mensagemState,
        exibir: true,
        mensagem: 'Logout Não Realizado!',
        tipo: MensagemTipo.Error,
        exibirBotao: true
      } )

    } )

    return () => {

      abortController.abort()

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] )

  return (
    <>
      <Grid
        container
        justifyContent='center'
        alignItems='center'
        height='60vh'
      >
        <Grid item xs={10} sm={8} md={6} lg={4}>
          <Paper>
            <Box
              sx={{ backgroundColor: 'primary.main', padding: 2 }}
              textAlign='center'
            >
              <img src={'imagens/'.concat( process.env.REACT_APP_PASTA_IMAGENS as string ).concat( '/logoFundoBranco.png' )} width={200} alt={process.env.REACT_APP_TITULO} />
              <Typography component="p" variant="h6" color="white">
                Versão
                <Typography component="span" variant="body1" color="white">
                  &nbsp;{VERSAO_SISTEMA}&nbsp;
                  <Typography component="span" variant="h6" color="white">
                    {EMDESENVOLVIMENTO ? 'VERSÃO DESENVOLVIMENTO!!!' : ''}
                  </Typography>
                </Typography>
              </Typography>
            </Box>
            <Box
              sx={{ backgroundColor: 'white', padding: 2, mx: 5 }}

            >
              <Grid>
                <Grid item textAlign='center'>
                  <Typography variant="h4" fontFamily='sans-serif' fontWeight='bolder' color="primary.main">
                    Logout...
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  )

}