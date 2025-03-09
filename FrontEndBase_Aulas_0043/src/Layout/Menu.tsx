import React, { useContext } from 'react'

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import { styled } from '@mui/material/styles';

import { ContextoGlobal, ContextoGlobalInterface } from '../GlobalStates/ContextoGlobal';

import MenuItem from './MenuItem';
import { MenuOpcoesInterface } from './MenuCls';

const drawerWidth = Math.min( window.innerWidth, 450 );

const Offset = styled( 'div' )( ( { theme } ) => theme.mixins.toolbar );

export default function Menu () {

  const { layoutState, setLayoutState } = useContext( ContextoGlobal ) as ContextoGlobalInterface

  return (
    <>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', marginBottom: -100 },
          zIndex: ( theme ) => theme.zIndex.appBar - 1
        }}
        anchor='left'
        open={layoutState.exibirMenu}
        onClose={() => { setLayoutState( { ...layoutState, exibirMenu: false } ) }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List
            sx={{ width: '100%', maxWidth: drawerWidth, bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            {layoutState.opcoesMenu.map( ( menu: MenuOpcoesInterface, indice: number ) =>
              <MenuItem deslocamento={0} key={indice} menu={menu} />
            )}
          </List>
          <Offset />
        </Box>
      </Drawer>
    </>
  )
}