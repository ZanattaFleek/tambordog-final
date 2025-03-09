import React, { useContext, useState } from 'react'
import { ContextoGlobal, ContextoGlobalInterface } from '../../GlobalStates/ContextoGlobal'
import BackEndAPI from '../../Services/BackEndAPI'
import { Box, Button, Grid, Paper, Typography } from '@mui/material'
import InputText from '../../DevComponents/InputText'
import { MensagemTipo } from '../../GlobalStates/MensagemState'
import { EMDESENVOLVIMENTO } from '../../ImportBackend/Config/emDesenvolvimento'
import { useNavigate } from 'react-router-dom'
import { RespostaPadraoInterface } from '../../ImportBackend/Interfaces/PadraoInterfaces'
import { ClsLogout } from './LogoutCls'

interface AlterarSenhaInterface {
  senhaAtual: string
  novaSenha: string
  novaSenhaConfirmacao: string
}

export default function AlterarSenha () {

  const dados: AlterarSenhaInterface = EMDESENVOLVIMENTO ? {
    novaSenha: 'Teste123',
    novaSenhaConfirmacao: 'Teste123',
    senhaAtual: 'Teste123'
  } : {
    senhaAtual: '',
    novaSenha: '',
    novaSenhaConfirmacao: ''
  }

  const contexto = useContext( ContextoGlobal ) as ContextoGlobalInterface

  const { mensagemState, setMensagemState } = ( useContext( ContextoGlobal ) as ContextoGlobalInterface )

  const [alterarSenhaState, setAlterarSenhaState] = useState<AlterarSenhaInterface>( dados )

  const [exibirSenha, setExibirSenha] = useState<boolean>( false )

  const [validado, setValidado] = useState<boolean>( false )

  const navigate = useNavigate()

  const clsApi = new BackEndAPI()

  const handleExibirSenha = () => {
    setExibirSenha( !exibirSenha )
  }

  const validarSenhas = ( rs: AlterarSenhaInterface ) => {
    setValidado( rs.novaSenha === rs.novaSenhaConfirmacao && rs.senhaAtual.length > 0 )
  }

  const alterarSenha = () => {

    if ( alterarSenhaState.novaSenha === alterarSenhaState.novaSenhaConfirmacao ) {

      const mutation: string = `
      alterarSenha(senhaAtual: "${alterarSenhaState.senhaAtual}", novaSenha: "${alterarSenhaState.novaSenha}") {
        ok
        mensagem
      }
    `

      clsApi.mutation<RespostaPadraoInterface>( mutation, 'alterarSenha', 'Alterando Senha', contexto ).then( rs => {

        if ( rs.ok ) {

          setMensagemState( {
            ...mensagemState,
            exibir: true,
            titulo: 'Senha Alterada!',
            mensagem: 'Senha Alterada Com Sucesso!',
            tipo: MensagemTipo.Info,
            exibirBotao: true
          } )


        } else {
          setMensagemState( {
            ...mensagemState,
            exibir: true,
            titulo: 'Erro ao Alterar Senha!',
            mensagem: 'Tente novamente!',
            tipo: MensagemTipo.Error,
            exibirBotao: true
          } )
        }

        ( new ClsLogout() ).efetuarLogout( contexto.setLoginState, contexto.setLayoutState, navigate )

      } ).catch( () => {

        setMensagemState( {
          ...mensagemState,
          exibir: true,
          titulo: 'Erro!!!',
          mensagem: 'Alteração de Senha Não Realizada! Consulte Suporte!!!',
          tipo: MensagemTipo.Error,
          exibirBotao: true
        } )

      } )

    }

  }

  return (
    <>
      <Grid
        container
        justifyContent='center'
        alignItems='center'
        height='100vh'
      >
        <Grid item xs={10} sm={8} md={6} lg={4}>
          <Paper>
            <Box
              sx={{ backgroundColor: 'primary.main', padding: 2 }}
              textAlign='center'
            >
              <img src={'imagens/'.concat( process.env.REACT_APP_PASTA_IMAGENS as string ).concat( '/logoFundoBranco.png' )} width={200} alt={process.env.REACT_APP_TITULO} />
            </Box>
            <Box sx={{ backgroundColor: 'white', padding: 2, mx: 5 }}            >
              <Grid>
                <Grid item textAlign='center'>
                  <Typography variant="h4" fontFamily='sans-serif' fontWeight='bolder' color="primary.main">
                    Alterar Senha
                  </Typography>
                </Grid>

                <Grid item>
                  <InputText
                    dados={alterarSenhaState}
                    field='senhaAtual'
                    label='Senha Atual'
                    type={exibirSenha ? "text" : "password"}
                    setState={setAlterarSenhaState}
                    iconeEnd='visibility'
                    onClickIconeEnd={handleExibirSenha}
                    afterChange={( v ) => validarSenhas( v )}
                  />
                </Grid>

                <Grid item>
                  <InputText
                    dados={alterarSenhaState}
                    field='novaSenha'
                    label='Nova Senha'
                    type={exibirSenha ? "text" : "password"}
                    setState={setAlterarSenhaState}
                    iconeEnd='visibility'
                    onClickIconeEnd={handleExibirSenha}
                    afterChange={( v ) => validarSenhas( v )}
                  />
                </Grid>

                <Grid item>
                  <InputText
                    dados={alterarSenhaState}
                    field='novaSenhaConfirmacao'
                    label='Confirmar Nova Senha'
                    type={exibirSenha ? "text" : "password"}
                    setState={setAlterarSenhaState}
                    iconeEnd='visibility'
                    onClickIconeEnd={handleExibirSenha}
                    afterChange={( v ) => validarSenhas( v )}
                  />
                </Grid>

                <Grid item textAlign='right'>
                  <Button variant='contained' disabled={!validado} onClick={() => alterarSenha()} sx={{ mt: 5 }}>Alterar Senha</Button>
                </Grid>

              </Grid>

            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  )

}