import React, { useState, useContext } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Avatar from '@mui/material/Avatar'
import { ContextoGlobal, ContextoGlobalInterface } from '../GlobalStates/ContextoGlobal'

import { styled } from '@mui/material/styles'
import { MenuOpcoesInterface } from './MenuCls'
import MenuItem from './MenuItem'

const Offset = styled( 'div' )( ( { theme } ) => theme.mixins.toolbar )

export default function ElevateAppBar () {

  const contextoGlobal = useContext( ContextoGlobal ) as ContextoGlobalInterface

  const {
    layoutState,
    setLayoutState,
  } = contextoGlobal

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>( null )

  const handleOpenUserMenu = ( event: React.MouseEvent<HTMLElement> ) => {
    setAnchorElUser( event.currentTarget )
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser( null )
  }

  const toogleDrawer = () => {
    setLayoutState( { ...layoutState, exibirMenu: !layoutState.exibirMenu } )
  }

  const opcoesMenu: Array<MenuOpcoesInterface> = [
    {
      descricao: 'Alterar Senha',
      filhos: [],
      icon: 'lock_reset',
      modulo: '',
      permissao: '',
      path: '/AlterarSenha'
    },
    {
      descricao: 'Logout',
      filhos: [],
      icon: 'logout',
      modulo: '',
      permissao: '',
      path: '/Logout'
    }
  ]

  return (
    <>
      <AppBar>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toogleDrawer}
            edge="start"
            sx={{ mr: 2, flexGrow: 0 }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} >
            <img src={'imagens/'.concat( process.env.REACT_APP_PASTA_IMAGENS as string ).concat( '/logoFundoBranco.png' )} width={90} alt="Cooperbom" />
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {/* //TODO - RETIRAR 
            <span style={{ marginRight: '10px' }}>
              {contextoGlobal.loginState.idRepresentante}
            </span>
            <span style={{ marginRight: '10px' }}>
              {contextoGlobal.loginState.perDescontoMaximo}
            </span>
            */}
            <Tooltip title="Configurações">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean( anchorElUser )}
              onClose={handleCloseUserMenu}
            >
              {opcoesMenu.map( ( menu: MenuOpcoesInterface, indice: number ) => (
                <MenuItem deslocamento={0} key={indice} menu={menu} />
              ) )}
            </Menu>

          </Box>
        </Toolbar>
      </AppBar>
      <Offset />
    </>
  )
}