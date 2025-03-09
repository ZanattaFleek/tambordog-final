import React, { useContext } from 'react';
import { ContextoGlobal, ContextoGlobalInterface } from '../globalstate/ContextoGlobal';
import Condicional from '../Layout/Condicional';

import { Box, Button, Dialog, Grid, Icon, Typography, useTheme, CircularProgress } from '@mui/material'
import { MensagemTipo } from '../globalstate/MensagemState';

export default function Mensagem() {

  const theme = useTheme()

  const { mensagemState, setMensagemState } = (useContext(ContextoGlobal) as ContextoGlobalInterface)

  const btResposta = (resposta: boolean) => {
    if (mensagemState.cb) {
      fecharJanela()
      mensagemState.cb(resposta)
    }
  }

  const fecharJanela = () => {
    setMensagemState({ ...mensagemState, exibir: false })
  }

  const exibirBotao = (): boolean =>
    (typeof mensagemState.exibirBotao === 'boolean' && mensagemState.exibirBotao)
    || (typeof mensagemState.exibirBotao === 'string' && mensagemState.exibirBotao.length > 0)

  const textoBotao = (): string =>
    (typeof mensagemState.exibirBotao === 'string' && mensagemState.exibirBotao.length > 0) ? mensagemState.exibirBotao
      : (typeof mensagemState.exibirBotao === 'boolean' && mensagemState.exibirBotao) ? 'Fechar' : ''

  const MensagemNoModal = () =>
    <Grid
      container
      justifyContent='center'
      alignItems='center'
      sx={{ margin: 'auto' }}
    >
      <Grid container
        justifyContent='center'
        alignItems='center'
        sx={{ margin: 'auto' }}
      >
        <Grid item xs={3} sx={{ padding: 2, border: 'none', borderWidth: '2px', borderColor: 'green', textAlign: 'center' }}>
          <Box>
            <Condicional condicao={mensagemState.tipo === MensagemTipo.Loading}>
              <CircularProgress />
            </Condicional>
            <Condicional condicao={mensagemState.tipo === MensagemTipo.Warning}>
              <Icon sx={{ fontSize: theme.mensagens.tamanhoIcone, color: theme.mensagens.corWarning }}>report_caca</Icon>
            </Condicional>
            <Condicional condicao={mensagemState.tipo === MensagemTipo.Error}>
              <Icon sx={{ fontSize: theme.mensagens.tamanhoIcone, color: theme.mensagens.corError }}>error_outlined</Icon>
            </Condicional>
            <Condicional condicao={mensagemState.tipo === MensagemTipo.Info}>
              <Icon sx={{ fontSize: theme.mensagens.tamanhoIcone, color: theme.mensagens.corInfo }}>info_outlined</Icon>
            </Condicional>
            <Condicional condicao={mensagemState.tipo === MensagemTipo.Sucesso}>
              <Icon sx={{ fontSize: theme.mensagens.tamanhoIcone, color: theme.mensagens.corSuccess }}>check_circle_outlined</Icon>
            </Condicional>
          </Box>
        </Grid>
        <Grid item xs={9} sx={{ padding: 2, border: 'none', borderWidth: '2px', borderColor: 'green', textAlign: 'left' }}>
          <Box>
            <Condicional condicao={mensagemState.titulo.length > 0}>
              <Typography color={theme.mensagens.corTitulo} variant="h6" sx={{ fontWeight: 'bolder' }}>
                {mensagemState.titulo}
              </Typography>
            </Condicional>
            <Condicional condicao={mensagemState.mensagem.length > 0}>
              <Typography color={theme.mensagens.corMensagem} fontFamily='Helvetica'>
                {mensagemState.mensagem}
              </Typography>
            </Condicional>
          </Box>
        </Grid>
        <Condicional condicao={exibirBotao()}>
          <Grid item xs={12} sx={{ padding: 1, border: 'none', borderWidth: '2px', borderColor: 'green', textAlign: 'right' }}>
            <Box>
              <Condicional condicao={mensagemState.exibirBotao !== 'SN'}>
                <Button variant='contained' color='primary' onClick={() => fecharJanela()} sx={{ margin: 2 }}>
                  {textoBotao()}
                </Button>
              </Condicional>
              <Condicional condicao={mensagemState.exibirBotao === 'SN'}>
                <Button variant='contained' color='primary' onClick={() => btResposta(true)} sx={{ margin: 2 }}>
                  Sim
                </Button>
                <Button variant='contained' color='primary' onClick={() => btResposta(false)} sx={{ margin: 2 }}>
                  Não
                </Button>
              </Condicional>
            </Box>
          </Grid>
        </Condicional>
      </Grid>

    </Grid>

  return (
    <Dialog
      fullWidth
      open={mensagemState.exibir}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <><MensagemNoModal /></>
    </Dialog>
  )
}