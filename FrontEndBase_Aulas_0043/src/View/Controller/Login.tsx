import React, { useContext, useState, useEffect } from 'react'
import { ContextoGlobal, ContextoGlobalInterface } from '../../GlobalStates/ContextoGlobal'
import BackEndAPI from '../../Services/BackEndAPI'
import { Box, Button, Grid, Paper, Typography } from '@mui/material'
import InputText from '../../DevComponents/InputText'
import { MensagemTipo } from '../../GlobalStates/MensagemState'
import { EMDESENVOLVIMENTO, VERSAO_SISTEMA } from '../../ImportBackend/Config/emDesenvolvimento'
import ClsUtils from 'zlib-utils'
import Condicional from '../../Layout/Condicional'
import { useNavigate } from 'react-router-dom'
import { UsuarioLogadoInterface, VersaoTypeInterface } from '../../ImportBackend/Interfaces/LoginInterfaces'
import { PermissoesInterface } from '../../ImportBackend/Interfaces/SistemaModuloPermissaoInterfaces'
import ClsMenu from '../../Layout/MenuCls'
import { PAGINAINICIALEMDESENVOLVIMENTO } from '../../Config/ConfigFrontEnd'
import MsgErroAplicacao from '../../DevComponents/MsgErroAplicacao'

interface LoginInterface {
  login: string
  senha: string
}

export default function Login () {

  const dados = {
    login: EMDESENVOLVIMENTO && process.env.REACT_APP_LOGIN ? process.env.REACT_APP_LOGIN : '',
    senha: EMDESENVOLVIMENTO && process.env.REACT_APP_SENHA ? process.env.REACT_APP_SENHA : ''
  }

  const contextoGlobal = useContext( ContextoGlobal ) as ContextoGlobalInterface

  const { layoutState, setLayoutState } = useContext( ContextoGlobal ) as ContextoGlobalInterface
  const { mensagemState, setMensagemState } = ( useContext( ContextoGlobal ) as ContextoGlobalInterface )
  const { loginState, setLoginState } = ( useContext( ContextoGlobal ) as ContextoGlobalInterface )

  const [usuarioState, setUsuarioState] = useState<LoginInterface>( dados )

  const [exibirSenhaState, setExibirSenha] = useState( false )

  const [versaoOK, setVersaoOK] = useState( true )

  const navigate = useNavigate()

  const clsApi = new BackEndAPI()

  const irPaginaInicial = () => {

    if ( EMDESENVOLVIMENTO ) {
      navigate( PAGINAINICIALEMDESENVOLVIMENTO )
    } else {
      navigate( '/' )
    }

  }

  const abortController: AbortController = new AbortController()

  useEffect( () => {

    const query: string = `
      versao {
        versao
        desenvolvimento
      }
    `

    clsApi.query<VersaoTypeInterface>( query, 'versao', 'Verificando Versao...', contextoGlobal, abortController ).then( rs => {

      setMensagemState( { ...mensagemState, exibir: false } )

      if ( rs.desenvolvimento === EMDESENVOLVIMENTO && rs.versao === VERSAO_SISTEMA ) {
        setVersaoOK( true )
        logarPorToken()
      } else {
        // navigate( '/ErroVersao' )
        setVersaoOK( false )
      }

    } ).catch( () => {

      navigate( '/ErroAplicacao' )

    } )

    return () => {

      abortController.abort()

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] )

  const handleExibirSenha = () => {
    setExibirSenha( !exibirSenhaState )
  }

  // TODO - ACRESCENTAR PROPRIEDADE LOGIN STATE
  const setarPermissoesEMenu = ( token: string, idUsuario: number, nome: string, idRepresentante: number, perDescontoMaximo: number ) => {

    const query: string = `
      getPermissoes {
        modulo
        permissao
      }
    `

    clsApi.query<Array<PermissoesInterface>>( query, 'getPermissoes', 'Recebendo Permissões...', contextoGlobal ).then( rsPermissoes => {

      const clsMenu = ( new ClsMenu( rsPermissoes ) )

      setLayoutState( { ...layoutState, opcoesMenu: clsMenu.MenuOpcoes } )
      // TODO - ACRESCENTAR PROPRIEDADE LOGIN STATE
      setLoginState( { ...loginState, permissoes: rsPermissoes, idUsuario: idUsuario, logado: true, token: token, nome: nome, idRepresentante: idRepresentante, perDescontoMaximo: perDescontoMaximo } )

      irPaginaInicial()

    } ).catch( err => {
      setMensagemState( {
        ...mensagemState,
        exibir: true,
        mensagem: 'Erro ao Receber Permissões. Consulte Suporte.',
        tipo: MensagemTipo.Error,
        exibirBotao: true
      } )
    } )

  }

  const logarPorToken = () => {

    const token = localStorage.getItem( 'token' );

    if ( token && token.length > 0 ) {

      // TODO - ACRESCENTAR PROPRIEDADE LOGIN STATE
      const mutation: string = `
        logarPorToken {
          idUsuario
          idRepresentante
          perDescontoMaximo
          mensagem
          ok
          token
          nome
        }
      `

      clsApi.mutation<UsuarioLogadoInterface>( mutation, 'logarPorToken', 'Login Automático...', contextoGlobal ).then( rs => {

        if ( rs.ok && rs.token && rs.token.length > 0 && rs.nome && rs.nome.length > 0 ) {

          // TODO - Trocar para Token em Memória....
          localStorage.setItem( 'token', rs.token )

          // TODO - ACRESCENTAR PROPRIEDADE LOGIN STATE
          setarPermissoesEMenu( rs.token, rs.idUsuario, rs.nome, rs.idRepresentante, rs.perDescontoMaximo )

        }

      } ).catch( () => {

        setMensagemState( {
          ...mensagemState,
          exibir: true,
          mensagem: 'Login Não Realizado!',
          tipo: MensagemTipo.Error,
          exibirBotao: true
        } )

      } )

    }

  }

  const logar = () => {

    // TODO - ACRESCENTAR PROPRIEDADE LOGIN STATE
    const mutation: string = `
      logar(login: ${( new ClsUtils() ).ConverterEmGql( usuarioState )} ) {
        idUsuario
        mensagem
        idRepresentante
        perDescontoMaximo
        ok
        token
        nome
      }
    `

    clsApi.mutation<UsuarioLogadoInterface>( mutation, 'logar', 'Logando', contextoGlobal ).then( rs => {

      if ( rs.ok && rs.token && rs.token.length > 0 && rs.nome && rs.nome.length > 0 ) {

        // TODO - Trocar para Token em Memória....
        localStorage.setItem( 'token', rs.token )

        // TODO - ACRESCENTAR PROPRIEDADE LOGIN STATE
        setarPermissoesEMenu( rs.token, rs.idUsuario, rs.nome, rs.idRepresentante, rs.perDescontoMaximo )

      } else {
        setMensagemState( {
          ...mensagemState,
          exibir: true,
          mensagem: 'Verifique Usuário / Senha!',
          tipo: MensagemTipo.Error,
          exibirBotao: true
        } )
      }

    } ).catch( () => {

      setMensagemState( {
        ...mensagemState,
        exibir: true,
        mensagem: 'Login Não Realizado!',
        tipo: MensagemTipo.Error,
        exibirBotao: true
      } )

    } )


  }

  return (
    <>
      <Condicional condicao={!versaoOK}>
        <MsgErroAplicacao titulo='Versão Desatualizada!' mensagem='Atualize a tela com CTRL + F5 ou botão reload no seu celular!'>
          <Button variant='contained' onClick={() => window.location.reload()} sx={{ width: '100%', backgroundColor: '#ff6333' }}>Atualizar!</Button>
        </MsgErroAplicacao>
      </Condicional>
      <Condicional condicao={versaoOK}>
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
                      Credenciais
                    </Typography>
                  </Grid>

                  <Grid item>
                    <InputText
                      dados={usuarioState}
                      field='login'
                      label='Usuário'
                      setState={setUsuarioState}
                    />
                  </Grid>

                  <Grid item>
                    <InputText
                      dados={usuarioState}
                      field='senha'
                      label='Senha'
                      type={exibirSenhaState ? "text" : "password"}
                      setState={setUsuarioState}
                      iconeEnd='visibility'
                      onClickIconeEnd={handleExibirSenha}
                    />
                  </Grid>

                  <Grid item textAlign='right'>
                    <Button variant='contained' onClick={() => logar()} sx={{ mt: 5 }}>Logar</Button>
                  </Grid>

                </Grid>

              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Condicional>

    </>
  )

}