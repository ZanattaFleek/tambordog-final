import React, { useState, useContext } from 'react'

import { BottomNavigation, BottomNavigationAction, Icon, Paper } from '@mui/material'

import { useLocation } from 'react-router-dom'
import Condicional from './Condicional'
import { ContextoGlobal, ContextoGlobalInterface } from '../GlobalStates/ContextoGlobal'
import { MenuOpcoesInterface } from './MenuCls'

export default function NavegacaoInferior () {

  const [value, setValue] = useState( '' )
  const { layoutState, setLayoutState } = useContext( ContextoGlobal ) as ContextoGlobalInterface

  const location = useLocation()

  return (
    <>
      <Condicional condicao={location.pathname === '/'}>
        <Paper sx={{ position: 'fixed', bottom: 35, left: 0, right: 0 }} elevation={3}>

          <BottomNavigation
            showLabels
            value={value}
            onChange={( event, newValue ) => {
              setLayoutState( { ...layoutState, opcaoNavegacaoInferior: newValue } )
              setValue( newValue );
            }}
          >
            {layoutState.opcoesMenu.map( ( menu: MenuOpcoesInterface, indice: number ) =>
              <BottomNavigationAction key={indice} label={menu.descricao} icon={
                <Icon>{menu.icon}</Icon>
              } />
            )}
          </BottomNavigation>
        </Paper>
      </Condicional>
    </>
  )

}