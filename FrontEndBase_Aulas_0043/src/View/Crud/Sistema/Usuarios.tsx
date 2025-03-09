import React, { useContext, useState } from 'react'
import { Container, Grid, IconButton, Paper, Typography } from '@mui/material';
import InputText from '../../../DevComponents/InputText';
import { UsuarioInterface, UsuarioRepresentanteInterface } from '../../../ImportBackend/Interfaces/UsuarioInterfaces';
import BackEndAPI from '../../../Services/BackEndAPI';
import { ContextoGlobal, ContextoGlobalInterface } from '../../../GlobalStates/ContextoGlobal';
import Condicional from '../../../Layout/Condicional';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { clsUtils } from 'zlib-utils';
import { RespostaPadraoInterface } from '../../../ImportBackend/Interfaces/PadraoInterfaces';
import { MensagemTipo } from '../../../GlobalStates/MensagemState';

import DataTable, { DataTableCabecalhoInterface } from '../../../DevComponents/DataTable';
import { useNavigate } from 'react-router-dom';
import ClsValidacao from '../../../Utils/ClsValidacao';
import UsuariosForm from './UsuariosForm';
import UsuariosAtribuirSenha from './UsuariosAtribuirSenha';
import UsuariosGrupos from './UsuariosGrupos';
import ExibirJSONDev from '../../../DevComponents/ExibirJSONDev';
import { EMDESENVOLVIMENTO } from '../../../ImportBackend/Config/emDesenvolvimento';
import { TipoClienteType } from '../../../ImportBackend/types/ConstantesDataTypes';

interface PesquisaInterface {
  descricao: string,
  idUnidade?: number,
  ativo?: boolean,
}

export enum StatusForm {
  Incluindo,
  Excluindo,
  Pesquisando,
  Editando,
  AtribuindoSenha,
  EditandoGrupos
}

export default function Usuarios () {

  const [statusForm, setStatusForm] = useState<StatusForm>( StatusForm.Pesquisando )

  const Cabecalho: Array<DataTableCabecalhoInterface> = [
    {
      campo: 'nome',
      cabecalho: 'Nome',
      alinhamento: 'left'
    },
    {
      campo: 'login',
      cabecalho: 'Login',
      alinhamento: 'left'
    },
    {
      campo: 'email',
      cabecalho: 'e-mail',
      alinhamento: 'left'
    },
    {
      campo: 'ativo',
      cabecalho: 'Ativo',
      alinhamento: 'left',
      format: ( v: boolean ) => { return v ? 'Sim' : 'Não' }
    }
  ]

  const ResetDados: UsuarioInterface =
  {
    idUsuario: 0,
    login: '',
    nome: '',
    whatsApp: '',
    email: '',
    ativo: false,
    idRepresentante: 0,
    cpfCnpj: '',
    nomeERP: '',
    tipo: TipoClienteType.PF
  }

  const TituloForm = {
    [StatusForm.Incluindo]: 'Inclusão de Novo Usuário',
    [StatusForm.Excluindo]: 'Exclusão de Usuário Não Utilizado',
    [StatusForm.Pesquisando]: 'Usuários são utilizados para controle de acesso ao sistema',
    [StatusForm.Editando]: 'Alteração de Dados de Usuários',
    [StatusForm.AtribuindoSenha]: 'Atribuir Senha ao Usuário',
    [StatusForm.EditandoGrupos]: 'Grupos de Usuários são utilizados para controle de permissões'
  }

  const clsApi = new BackEndAPI()

  const contexto = useContext( ContextoGlobal ) as ContextoGlobalInterface
  const { mensagemState, setMensagemState } = contexto

  const [dados, setDados] = useState<UsuarioInterface>( ResetDados )
  const [cpfCnpjJaCadastrado, setcpfCnpjJaCadastrado] = useState<boolean>( false )

  const [erros, setErros] = useState( {} )

  const [pesquisa, setPesquisa] = useState<PesquisaInterface>( { descricao: '' } )

  const [rsPesquisa, setRsPesquisa] = useState<Array<UsuarioInterface>>( [] )

  const navigate = useNavigate()

  const btFechar = () => {
    navigate( '/' )
  }

  const btIncluir = () => {
    setDados( ResetDados )
    setErros( {} )
    setStatusForm( StatusForm.Incluindo )
  }

  const btAtribuirSenha = ( rs: UsuarioInterface ) => {
    setDados( rs )
    setStatusForm( StatusForm.AtribuindoSenha )
  }

  const btEditarGrupos = ( rs: UsuarioInterface ) => {
    setDados( rs )
    setStatusForm( StatusForm.EditandoGrupos )
  }

  const btEditar = ( rs: UsuarioInterface ) => {
    setDados( rs )
    setStatusForm( StatusForm.Editando )
  }

  const btExcluir = ( rs: UsuarioInterface ) => {
    setDados( rs )
    setStatusForm( StatusForm.Excluindo )
  }

  const btCancelar = () => {
    setDados( ResetDados )
    setErros( {} )
    setStatusForm( StatusForm.Pesquisando )
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    let clsValidacao = new ClsValidacao()

    if ( dados.tipo === TipoClienteType.PF ) {
      retorno = clsValidacao.eCPF( 'cpfCnpj', dados, erros, retorno, true )
    } else {
      retorno = clsValidacao.eCNPJ( 'cpfCnpj', dados, erros, retorno, true )
    }

    if ( retorno ) {
      if ( cpfCnpjJaCadastrado ) {
        retorno = false
        erros = { ...erros, cpfCnpj: 'Já Cadastrado!' }
      }
    }

    retorno = clsValidacao.naoVazio( 'nome', dados, erros, retorno )
    retorno = clsValidacao.naoVazio( 'tipo', dados, erros, retorno )
    retorno = clsValidacao.naoVazio( 'login', dados, erros, retorno )
    retorno = clsValidacao.eEmail( 'email', dados, erros, retorno, true )
    retorno = clsValidacao.eTelefone( 'whatsApp', dados, erros, retorno, true )

    setErros( erros )

    return retorno
  }

  const btConfirmar = () => {
    if ( validarDados() ) {

      // Propriedades Que não devem ser enviadas
      delete dados.tentativaLogin
      delete dados.whatsAppConfirmado
      delete dados.emailConfirmado

      const mutation: string = `
        updateUsuario(dados: ${clsUtils.ConverterEmGql( dados )}) {
          ok
          mensagem
        }
      `
      clsApi.mutation<RespostaPadraoInterface>( mutation, 'updateUsuario', 'Atualizando Usuários...', contexto ).then( rs => {

        if ( rs.ok ) {
          setMensagemState( {
            ...mensagemState,
            titulo: 'Confirmado!',
            exibir: true,
            mensagem: statusForm === StatusForm.Incluindo ? 'Usuário Cadastrado com Sucesso!' : 'Dados Alterados!',
            tipo: MensagemTipo.Info,
            exibirBotao: true
          } )

          setDados( ResetDados )
          setStatusForm( StatusForm.Pesquisando )
          onClickPesquisa()
        } else {

          setMensagemState( {
            ...mensagemState,
            titulo: 'Erro...',
            exibir: true,
            mensagem: rs.mensagem,
            tipo: MensagemTipo.Error,
            exibirBotao: true
          } )

        }

      } ).catch( () => {

        setMensagemState( {
          ...mensagemState,
          exibir: true,
          mensagem: 'Usuário Não Atualizado!',
          tipo: MensagemTipo.Error,
          exibirBotao: true
        } )

      } )

    }
  }

  const atribuirSenhaUsuario = ( idUsuario: number, senha: string ) => {

    const mutation: string = `
      atribuirSenha(idUsuario: ${idUsuario}, senha: "${senha}") {
        ok
        mensagem
      }
    `

    clsApi.mutation<RespostaPadraoInterface>( mutation, 'atribuirSenha', 'Alterando a Senha do Usuário...', contexto ).then( rs => {

      if ( rs.ok ) {

        setMensagemState( {
          ...mensagemState,
          titulo: 'Confirmado!',
          exibir: true,
          mensagem: 'Senha Alterada com Sucesso!',
          tipo: MensagemTipo.Info,
          exibirBotao: true
        } )

        setDados( ResetDados )
        setStatusForm( StatusForm.Pesquisando )

      } else {

        setMensagemState( {
          ...mensagemState,
          titulo: 'Erro ao Alterar Senha!',
          exibir: true,
          mensagem: rs.mensagem,
          tipo: MensagemTipo.Error,
          exibirBotao: true
        } )

      }

    } )

  }

  const btConfirmarExclusao = () => {

    const mutation: string = `
      delUsuario(idUsuario: ${dados.idUsuario}) {
        ok
        mensagem
      }
    `

    clsApi.mutation<RespostaPadraoInterface>( mutation, 'delUsuario', 'Excluindo Usuário...', contexto ).then( rs => {

      if ( rs.ok ) {
        setMensagemState( {
          ...mensagemState,
          titulo: 'Confirmado!',
          exibir: true,
          mensagem: 'Usuário Excluído com Sucesso!',
          tipo: MensagemTipo.Info,
          exibirBotao: true
        } )

        setDados( ResetDados )
        setStatusForm( StatusForm.Pesquisando )
        onClickPesquisa()

      } else {

        setMensagemState( {
          ...mensagemState,
          titulo: 'Erro',
          exibir: true,
          mensagem: rs.mensagem,
          tipo: MensagemTipo.Error,
          exibirBotao: true
        } )

      }

    } ).catch( () => {

      setMensagemState( {
        ...mensagemState,
        titulo: 'Erro',
        exibir: true,
        mensagem: 'Usuário Não Excluído!',
        tipo: MensagemTipo.Error,
        exibirBotao: true
      } )

    } )

  }

  const onClickPesquisa = () => {
    const query = `
      getUsuarios(pesquisa: "${pesquisa.descricao}") {
        idUsuario
        login
        nome
        whatsApp
        email
        ativo
        idRepresentante
        cpfCnpj
        nomeERP
        tipo
        tentativaLogin
        whatsAppConfirmado
        emailConfirmado
      }
    `

    clsApi.query<Array<UsuarioInterface>>( query, 'getUsuarios', 'Pesquisando Usuários...', contexto ).then( rsUsuarios => {

      setRsPesquisa( rsUsuarios )

    } ).catch( () => {

      setMensagemState( {
        ...mensagemState,
        titulo: 'Erro! Consulte Suporte!',
        exibir: true,
        mensagem: 'Erro ao Consultar Usuários!',
        tipo: MensagemTipo.Error,
        exibirBotao: true
      } )

    } )

  }

  const btResetSenha = ( rsUsuario: UsuarioInterface ) => {
    const mutation = `
      resetSenhaPorEmail(idUsuario: ${rsUsuario.idUsuario}) {
        ok
        mensagem
      }
    `

    clsApi.mutation<RespostaPadraoInterface>( mutation, 'resetSenhaPorEmail', 'Reset Senha...', contexto ).then( rsResetSenha => {

      setMensagemState( {
        ...mensagemState,
        titulo: rsResetSenha.ok ? 'Sucesso!' : 'Erro!',
        exibir: true,
        mensagem: rsResetSenha.mensagem,
        tipo: rsResetSenha.ok ? MensagemTipo.Info : MensagemTipo.Error,
        exibirBotao: true
      } )

    } )

  }

  const pesquisarcpfCnpj = ( valor: string ): Promise<boolean> => {

    return new Promise( ( resolve, _reject ) => {


      const query: string = `
      consultarUsuarioPorcpfCnpj(cpfCnpj: "${valor}") {
          idUsuario
          }
          `

      if ( valor.length > 0 && ( valor.length === 14 || valor.length === 18 ) ) {
        clsApi.query<UsuarioInterface>( query, 'consultarUsuarioPorcpfCnpj', 'Pesquisando documento...', contexto ).then( rs => {
          if ( rs && rs.idUsuario && rs.idUsuario !== dados.idUsuario ) {
            setErros( { ...erros, cpfCnpj: 'Já Cadastrado!' } )
            setcpfCnpjJaCadastrado( true )
            resolve( false )
            setDados( { ...dados, cpfCnpj: valor } )
          } else {
            setErros( { ...erros, cpfCnpj: '' } )
            setcpfCnpjJaCadastrado( false )
            pesquisarRepresentanteERP( valor )
            resolve( true )
          }
        } )
      } else {
        setDados( { ...dados, cpfCnpj: valor, idRepresentante: 0, nomeERP: '' } )
        resolve( false )
      }

    } )
  }

  const pesquisarRepresentanteERP = ( cpfCnpj: string ): Promise<boolean> => {

    return new Promise( ( resolve, _reject ) => {


      const query: string = `
      consultarRepresentanteERP(cpfCnpj: "${cpfCnpj}") {
        idRepresentante
        nomeERP
        }
        `

      clsApi.query<UsuarioRepresentanteInterface>( query, 'consultarRepresentanteERP', 'Pesquisando ERP...', contexto ).then( rs => {
        if ( rs && rs.idRepresentante ) {
          setDados( { ...dados, cpfCnpj: cpfCnpj, idRepresentante: rs.idRepresentante, nomeERP: rs.nomeERP } )
        } else {
          setDados( { ...dados, cpfCnpj: cpfCnpj, idRepresentante: 0, nomeERP: '' } )
        }
      } ).catch( () => {
        setMensagemState( {
          cb: null,
          exibir: true,
          exibirBotao: true,
          mensagem: 'Erro na Consulta do ERP',
          tipo: MensagemTipo.Error,
          titulo: 'Erro ERP!'
        } )
      } )

    } )

  }

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 5 }}>

        <Paper variant="outlined" sx={{ padding: 2 }}>
          <Grid container sx={{ display: 'flex', alignItems: 'center' }}>

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography component="h5" variant="h5" align="left">
                Cadastro de Usuários
                <Typography variant="body2" gutterBottom>
                  {TituloForm[statusForm]}
                </Typography>
              </Typography>

              <IconButton onClick={() => btFechar()}>
                <CloseIcon />
              </IconButton>
            </Grid>

            <Condicional condicao={statusForm === StatusForm.Pesquisando}>

              <Grid item xs={12} sm={10} sx={{ mb: 3 }}>

                <InputText
                  dados={pesquisa}
                  field='descricao'
                  label='Pesquisar'
                  setState={setPesquisa}
                  iconeEnd="search"
                  onClickIconeEnd={() => onClickPesquisa()}
                  mapKeyPress={[{ key: 'Enter', onKey: onClickPesquisa }]}
                />

              </Grid>

              <Grid item xs={12} sm={2} sx={{ textAlign: { xs: 'right', sm: 'center' } }}>
                <Button variant='contained' onClick={() => btIncluir()}>Incluir</Button>
              </Grid>

            </Condicional>

            <UsuariosForm
              statusForm={statusForm}
              dados={dados}
              setDados={setDados}
              erros={erros}
              btCancelar={btCancelar}
              btConfirmar={btConfirmar}
              btConfirmarExclusao={btConfirmarExclusao}
              pesquisarCpfCnpj={pesquisarcpfCnpj}
            />

            <UsuariosAtribuirSenha
              statusForm={statusForm}
              dados={dados}
              onConfirmar={atribuirSenhaUsuario}
              onCancelar={btCancelar}
            />

            <UsuariosGrupos
              statusForm={statusForm}
              dados={dados}
              onCancelar={btCancelar}
              clsApi={clsApi}
            />

            <Condicional condicao={statusForm === StatusForm.Pesquisando}>
              <Grid item xs={12} sx={{ mt: 3 }}>
                <DataTable dados={rsPesquisa} cabecalho={Cabecalho}
                  acoes={[
                    { icone: 'people', toolTip: 'Grupos', onAcionador: btEditarGrupos },
                    { icone: 'delete', toolTip: 'Excluir', onAcionador: btExcluir },
                    { icone: 'create', toolTip: 'Editar', onAcionador: btEditar },
                    { icone: 'key', toolTip: 'Atribuir Senha', onAcionador: btAtribuirSenha },
                    { icone: 'vpn_lock', toolTip: 'Senha Por e-mail', onAcionador: btResetSenha }
                  ]}
                />
              </Grid>
            </Condicional>

          </Grid>
        </Paper>

        <ExibirJSONDev oque={['Dados', dados]} exibir={EMDESENVOLVIMENTO} />

      </Container>
    </>
  )
}