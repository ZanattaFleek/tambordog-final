import React, { useContext, useState } from 'react'
import { Container, Grid, IconButton, Paper, Typography } from '@mui/material';
import InputText from '../../../DevComponents/InputText';
import { GrupoInterface } from '../../../ImportBackend/Interfaces/GrupoInterfaces';
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
import { EMDESENVOLVIMENTO } from '../../../ImportBackend/Config/emDesenvolvimento';
import GruposForm from './GruposForm';
import GruposUsuarios from './GruposUsuarios';
import GruposPermissoes from './GruposPermissoes';

interface PesquisaInterface {
  descricao: string
}

export enum StatusForm {
  Incluindo,
  Excluindo,
  Pesquisando,
  Editando,
  EditandoUsuarios,
  EditandoPermissoes
}

export default function Grupos () {

  const [statusForm, setStatusForm] = useState<StatusForm>( StatusForm.Pesquisando )

  const Cabecalho: Array<DataTableCabecalhoInterface> = [
    {
      campo: 'descricao',
      cabecalho: 'Descrição',
      alinhamento: 'left'
    }
  ]

  // TODO - Retirar
  const ResetDados: GrupoInterface = EMDESENVOLVIMENTO ? {
    idGrupo: 0,
    descricao: 'Teste Grupo'
  } :
    {
      idGrupo: 0,
      descricao: ''
    }

  const TituloForm = {
    [StatusForm.Incluindo]: 'Inclusão de Novo Grupo',
    [StatusForm.Excluindo]: 'Exclusão de Grupo Não Utilizado',
    [StatusForm.Pesquisando]: 'Grupos são utilizados para controle de acesso ao sistema',
    [StatusForm.Editando]: 'Alteração de Dados de Grupos',
    [StatusForm.EditandoUsuarios]: 'Usuários de Grupos são utilizados para controle de permissões',
    [StatusForm.EditandoPermissoes]: 'Permissões de Grupos são utilizados para controle de permissões',
  }

  const clsApi = new BackEndAPI()

  const contexto = useContext( ContextoGlobal ) as ContextoGlobalInterface
  const { mensagemState, setMensagemState } = contexto

  const [dados, setDados] = useState<GrupoInterface>( ResetDados )

  const [erros, setErros] = useState( {} )

  const [pesquisa, setPesquisa] = useState<PesquisaInterface>( { descricao: '' } )

  const [rsPesquisa, setRsPesquisa] = useState<Array<GrupoInterface>>( [] )

  const navigate = useNavigate()

  const btFechar = () => {
    navigate( '/' )
  }

  const btIncluir = () => {
    setDados( ResetDados )
    setErros( {} )
    setStatusForm( StatusForm.Incluindo )
  }

  const btEditarUsuarios = ( rs: GrupoInterface ) => {
    setDados( rs )
    setStatusForm( StatusForm.EditandoUsuarios )
  }

  const btEditarPermissoes = ( rs: GrupoInterface ) => {
    setDados( rs )
    setStatusForm( StatusForm.EditandoPermissoes )
  }

  const btEditar = ( rs: GrupoInterface ) => {
    setDados( rs )
    setStatusForm( StatusForm.Editando )
  }

  const btExcluir = ( rs: GrupoInterface ) => {
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

    retorno = clsValidacao.naoVazio( 'descricao', dados, erros, retorno )

    setErros( erros )

    return retorno
  }

  const btConfirmar = () => {
    if ( validarDados() ) {

      const mutation: string = `
        updateGrupo(dados: ${clsUtils.ConverterEmGql( dados )}) {
          ok
          mensagem
        }
      `
      clsApi.mutation<RespostaPadraoInterface>( mutation, 'updateGrupo', 'Atualizando Grupos...', contexto ).then( rs => {

        if ( rs.ok ) {
          setMensagemState( {
            ...mensagemState,
            titulo: 'Confirmado!',
            exibir: true,
            mensagem: statusForm === StatusForm.Incluindo ? 'Grupo Cadastrado com Sucesso!' : 'Dados Alterados!',
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
          mensagem: 'Grupo Não Atualizado!',
          tipo: MensagemTipo.Error,
          exibirBotao: true
        } )

      } )

    }
  }

  const btConfirmarExclusao = () => {

    const mutation: string = `
      delGrupo(idGrupo: ${dados.idGrupo}) {
        ok
        mensagem
      }
    `

    clsApi.mutation<RespostaPadraoInterface>( mutation, 'delGrupo', 'Excluindo Grupo...', contexto ).then( rs => {

      if ( rs.ok ) {
        setMensagemState( {
          ...mensagemState,
          titulo: 'Confirmado!',
          exibir: true,
          mensagem: 'Grupo Excluído com Sucesso!',
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
        mensagem: 'Grupo Não Excluído!',
        tipo: MensagemTipo.Error,
        exibirBotao: true
      } )

    } )

  }

  const onClickPesquisa = () => {
    const query = `
      getGrupos(pesquisa: "${pesquisa.descricao}") {
        idGrupo
        descricao
      }
    `

    clsApi.query<Array<GrupoInterface>>( query, 'getGrupos', 'Pesquisando Grupos...', contexto ).then( rsGrupos => {

      setRsPesquisa( rsGrupos )

    } ).catch( () => {

      setMensagemState( {
        ...mensagemState,
        titulo: 'Erro! Consulte Suporte!',
        exibir: true,
        mensagem: 'Erro ao Consultar Grupos!',
        tipo: MensagemTipo.Error,
        exibirBotao: true
      } )

    } )

  }

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 5 }}>

        <Paper variant="outlined" sx={{ padding: 2 }}>
          <Grid container sx={{ display: 'flex', alignItems: 'center' }}>

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography component="h5" variant="h5" align="left">
                Cadastro de Grupos
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

            <GruposForm
              statusForm={statusForm}
              dados={dados}
              setDados={setDados}
              erros={erros}
              btCancelar={btCancelar}
              btConfirmar={btConfirmar}
              btConfirmarExclusao={btConfirmarExclusao}
            />

            <GruposUsuarios
              statusForm={statusForm}
              dados={dados}
              onCancelar={btCancelar}
              clsApi={clsApi}
            />

            <GruposPermissoes
              statusForm={statusForm}
              dados={dados}
              onCancelar={btCancelar}
              clsApi={clsApi}
              contexto={contexto}
            />

            <Condicional condicao={statusForm === StatusForm.Pesquisando}>
              <Grid item xs={12} sx={{ mt: 3 }}>
                <DataTable dados={rsPesquisa} cabecalho={Cabecalho}
                  acoes={[
                    { icone: 'people', toolTip: 'Editar Usuários', onAcionador: btEditarUsuarios },
                    { icone: 'settings', toolTip: 'Editar Permissões', onAcionador: btEditarPermissoes },
                    { icone: 'delete', toolTip: 'Excluir Grupo', onAcionador: btExcluir },
                    { icone: 'create', toolTip: 'Editar Grupo', onAcionador: btEditar },
                  ]}

                />
              </Grid>
            </Condicional>

          </Grid>
        </Paper>

      </Container>
    </>
  )
}