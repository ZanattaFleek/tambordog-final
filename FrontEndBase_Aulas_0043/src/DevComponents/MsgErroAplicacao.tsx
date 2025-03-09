import React from 'react'
import { Box, Grid, Paper, ThemeProvider, Typography } from '@mui/material'
import { EMDESENVOLVIMENTO, VERSAO_SISTEMA } from '../ImportBackend/Config/emDesenvolvimento'
import { THEME } from '../Config/Theme'
import Condicional from '../Layout/Condicional'

interface PropsInterface {
  mensagem: string
  children: any
  titulo: string
  corTitulo?: string
}

export default function MsgErroAplicacao ( { mensagem, children, titulo, corTitulo = 'primary.main' }: PropsInterface ) {

  return (
    <>
      <ThemeProvider theme={THEME}>
        <Grid
          container
          justifyContent='center'
          alignItems='center'
          height='100vh'
        >
          <Grid item xs={10} sm={8} md={6} lg={4}>
            <Paper>
              <Box
                sx={{ backgroundColor: corTitulo, padding: 2 }}
                textAlign='center'
              >
                <img src={process.env.REACT_APP_PASTA?.concat( '/logoFundoBranco.png' )} width={150} alt={process.env.REACT_APP_TITULO} />
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
                textAlign='center'
              >
                <Typography variant="h4" fontFamily='sans-serif' fontWeight='bolder' color={corTitulo}>
                  {titulo}
                </Typography>

                <Typography variant="body1" fontFamily='sans-serif' fontWeight='bolder' color="primary.secondary">
                  {mensagem}
                </Typography>

              </Box>
              <Condicional condicao={children}>
                {children}
              </Condicional>
            </Paper>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  )
}