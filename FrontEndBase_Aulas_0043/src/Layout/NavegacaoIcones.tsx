import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import Condicional from './Condicional'

import { Box, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'

import { ContextoGlobal, ContextoGlobalInterface } from '../GlobalStates/ContextoGlobal'

import { useLocation } from 'react-router-dom'
import { MenuOpcoesInterface } from './MenuCls'

export default function NavegacaoIcones () {

  const { layoutState, setLayoutState } = useContext( ContextoGlobal ) as ContextoGlobalInterface

  const location = useLocation()

  const navigate = useNavigate();

  const irPara = ( url: string ) => {
    navigate( url )
    setLayoutState( { ...layoutState, exibirMenu: false } )
  }

  const opcoesParaExibir = (): Array<MenuOpcoesInterface> => {

    let retorno: Array<MenuOpcoesInterface> = []

    if ( layoutState.opcaoNavegacaoInferior >= 0 ) {
      if ( layoutState.opcoesMenu[layoutState.opcaoNavegacaoInferior].filhos.length > 0 ) {
        retorno = layoutState.opcoesMenu[layoutState.opcaoNavegacaoInferior].filhos
      }
    }

    return retorno

  }

  return (
    <>

      <Condicional condicao={
        location.pathname === '/'
        && layoutState.opcaoNavegacaoInferior < 0
      }>
        <Grid
          container
          justifyContent='center'
          alignItems='center'
          height='70vh'
          sx={{ margin: 'auto' }}
        >
          <Grid item xs={12} sx={{ flexDirection: 'column', textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mt: 5, mb: 5 }}>{process.env.REACT_APP_TITULO}</Typography>
            <img src={process.env.REACT_APP_PASTA?.concat( '/logo.png' )} width={250} alt={process.env.REACT_APP_TITULO} />
          </Grid>
        </Grid>
      </Condicional >
      <Condicional condicao={
        location.pathname === '/'
        && layoutState.opcaoNavegacaoInferior >= 0
      }>
        <Grid
          container
          justifyContent='center'
          alignItems='center'
          height='70vh'
          sx={{ maxWidth: 'md', margin: 'auto' }}
        >
          {opcoesParaExibir().map( ( menu, indice ) =>
            <Grid item xs={4} key={indice} sx={{ flexDirection: 'column', textAlign: 'center' }}>
              <IconButton onClick={() => irPara( menu.path )} >
                <Icon sx={{
                  fontSize: '35px',
                  marginBottom: 3
                }}>{menu.icon}</Icon>
              </IconButton>
              <Typography variant="body2">{menu.descricao}</Typography>
              {/*
              
              <IconButton >
                <Icon sx={{
                  padding: '15px',
                  borderRadius: '50%',
                  backgroundColor: 'grey',
                  height: '70px',
                  width: '70px',
                  fontSize: '38px'
                }} >{menu.icon}</Icon>
              </IconButton>
              
                */}
            </Grid>
          )}
        </Grid>
      </Condicional>
    </>
  )

}