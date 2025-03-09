import React, { useState, useEffect, useContext } from 'react'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { UsuarioInterface } from '../../../ImportBackend/Interfaces/UsuarioInterfaces'
import Condicional from '../../../Layout/Condicional'
import { StatusForm } from './Grupos'
import CloseIcon from '@mui/icons-material/Close'
import ShowText from '../../../DevComponents/ShowText'
import { GrupoInterface } from '../../../ImportBackend/Interfaces/GrupoInterfaces'
import BackEndAPI from '../../../Services/BackEndAPI'
import { ContextoGlobal, ContextoGlobalInterface } from '../../../GlobalStates/ContextoGlobal'
import { MensagemTipo } from '../../../GlobalStates/MensagemState'
import DataTable, { DataTableCabecalhoInterface } from '../../../DevComponents/DataTable'
import SearchText from '../../../DevComponents/SearchText'
import { RespostaPadraoInterface } from '../../../ImportBackend/Interfaces/PadraoInterfaces'
import Typography from '@mui/material/Typography'

interface PropsInterface {
  statusForm: StatusForm
  dados: GrupoInterface
  clsApi: BackEndAPI
  onCancelar: () => void
}

export default function UsuariosGrupos ( { clsApi, statusForm, dados, onCancelar }: PropsInterface ) {

  const [rsUsuarios, setRsUsuarios] = useState<Array<UsuarioInterface>>( [] )
  // const [rsUsuarioGrupos, setRsUsuarioGrupos] = useState<Array<GrupoInterface>>( [] )

  const contexto = useContext( ContextoGlobal ) as ContextoGlobalInterface
  const { mensagemState, setMensagemState } = contexto

  const Cabecalho: Array<DataTableCabecalhoInterface> = [
    {
      campo: 'nome',
      cabecalho: 'Nome',
      alinhamento: 'left'
    }
  ]

  const btExcluirUsuario = ( usuario: UsuarioInterface ) => {

    const mutation = `
        excluirGrupoUsuario(idUsuario: ${usuario.idUsuario}, idGrupo: ${dados.idGrupo}) {
          ok
          mensagem
        }
      `

    clsApi.mutation<RespostaPadraoInterface>( mutation, 'excluirGrupoUsuario', 'Excluindo Usuário...', contexto ).then( rs => {

      if ( rs.ok ) {

        pesquisarUsuarioGrupos()

      } else {

        setMensagemState( {
          ...mensagemState,
          exibir: true,
          mensagem: rs.mensagem,
          tipo: MensagemTipo.Error,
          exibirBotao: true
        } )

      }

    } )

  }

  const abortController: AbortController = new AbortController()

  const pesquisarUsuarioGrupos = () => {
    const query = `
      getGrupoUsuarios(idGrupo: ${dados.idGrupo}) {
        idUsuario
        nome
      }
    `

    clsApi.query<Array<UsuarioInterface>>( query, 'getGrupoUsuarios', 'Recebendo Usuários...', contexto, abortController ).then( rsUsuarios => {

      setRsUsuarios( rsUsuarios )

    } ).catch( () => {

      setMensagemState( {
        ...mensagemState,
        titulo: 'Erro! Consulte Suporte!',
        exibir: true,
        mensagem: 'Erro ao Consultar Usuários de Grupos!',
        tipo: MensagemTipo.Error,
        exibirBotao: true
      } )

    } )
  }

  useEffect( () => {

    if ( [StatusForm.EditandoUsuarios].includes( statusForm ) ) {

      pesquisarUsuarioGrupos()

    }

    return () => {

      abortController.abort()

    }

    //eslint-disable-next-line
  }, [dados, statusForm] )

  const [novoUsuario, setNovoUsuario] = useState<UsuarioInterface | null>( null )

  const novoUsuarioSelecionado = ( v: UsuarioInterface | null ) => {

    setNovoUsuario( v )

    if ( v ) {

      const mutation = `
        incluirGrupoUsuario(idUsuario: ${v.idUsuario}, idGrupo: ${dados.idGrupo}) {
          ok
          mensagem
        }
      `

      clsApi.mutation<RespostaPadraoInterface>( mutation, 'incluirGrupoUsuario', 'Incluindo Usuário...', contexto ).then( rs => {

        if ( rs.ok ) {

          pesquisarUsuarioGrupos()

        } else {

          setMensagemState( {
            ...mensagemState,
            exibir: true,
            mensagem: rs.mensagem,
            tipo: MensagemTipo.Error,
            exibirBotao: true
          } )

        }

      } )

    }

  }

  return (
    <>
      <Condicional condicao={[StatusForm.EditandoUsuarios].includes( statusForm )}>
        <Grid item xs={12}>
          <ShowText dados={dados} field='descricao' label='Descrição' />
        </Grid>

        <Grid item xs={12}>

          <SearchText
            onChange={novoUsuarioSelecionado}
            objQuery='{idUsuario, nome}'
            campoPesquisa='nome'
            campoID='idUsuario'
            label='Adicionar Usuário'
            value={novoUsuario}
            mensagemQuery='Procurando Usuários...'
            campoQuery='pesquisa'
            nomeQuery='getUsuarios'
          />

        </Grid>

        <Grid item xs={12} sx={{ mt: 3 }}>

          <Typography component="h6" variant="h6" align="left">
            Usuários Ativos para Este Grupo
          </Typography>

          <DataTable
            dados={rsUsuarios}
            cabecalho={Cabecalho}
            acoes={[{ icone: 'delete', toolTip: 'Retirar Usuário do Grupo', onAcionador: btExcluirUsuario }]}
          />

        </Grid>

        <Grid item xs={12} sx={{ mt: 3, textAlign: 'right' }}>

          <Button variant='contained' startIcon={<CloseIcon />} sx={{ py: 1 }} onClick={() => onCancelar()}>Cancelar</Button>

        </Grid>

      </Condicional>
    </>
  )

}