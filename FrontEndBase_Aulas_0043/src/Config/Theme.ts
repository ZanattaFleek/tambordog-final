/*
xs, extra-small: 0px
sm, small: 600px
md, medium: 900px
lg, large: 1200px
xl, extra-large: 1536px

xs={10} sm={8} md={6} lg={4} xl={2}
*/

import { createTheme } from "@mui/material"
import { ptBR } from '@mui/material/locale'

export const THEME = createTheme( {
  components: {
    MuiIconButton: {
      defaultProps: {
        color: 'primary',
        style: { height: '35px', width: '35px' }
      }
    }
  },
  /*
  components: {
    MuiIcon: {
      styleOverrides: {
        root: {
          // Match 24px = 3 * 2 + 1.125 * 16
          boxSizing: 'content-box',
          padding: 5,
          fontSize: '1.125rem',
        },
      },
    },
  },
  */
  inputs: {
    marginTop: 2
  },
  menu: {
    corIcone: '#00702c',
    tamanhoIcone: 40
  },
  mensagens: {
    corWarning: 'orange',
    corError: 'red',
    corInfo: 'blue',
    corSuccess: 'green',
    corFundo: 'black',
    corTitulo: 'black',
    corMensagem: 'gray',
    tamanhoIcone: 50
  },
  palette: {
    primary: {
      main: '#00702c'
    }
  }
}, ptBR );

declare module '@mui/material/styles' {
  interface Theme {
    menu: {
      corIcone: string
      tamanhoIcone: number
    }
    inputs: {
      marginTop: number
    }
    mensagens: {
      corWarning: string
      corError: string
      corInfo: string
      corSuccess: string
      corFundo: string
      corTitulo: string
      corMensagem: string
      tamanhoIcone: number
    }
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    inputs: {
      marginTop: number
    }
    menu: {
      corIcone: string
      tamanhoIcone: number
    },
    mensagens: {
      corWarning: string
      corError: string
      corInfo: string
      corSuccess: string
      corFundo: string
      corTitulo: string
      corMensagem: string
      tamanhoIcone: number
    }
  }
}
