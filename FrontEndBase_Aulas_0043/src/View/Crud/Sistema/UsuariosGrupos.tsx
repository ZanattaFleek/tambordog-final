import React, { useState, useEffect, useContext } from 'react'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { UsuarioInterface } from '../../../ImportBackend/Interfaces/UsuarioInterfaces'
import Condicional from '../../../Layout/Condicional'
import { StatusForm } from './Usuarios'
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
  dados: UsuarioInterface
  clsApi: BackEndAPI
  onCancelar: () => void
}

export default function UsuariosGrupos ( { clsApi, statusForm, dados, onCancelar }: PropsInterface ) {

  const [rsGrupos, setRsGrupos] = useState<Array<GrupoInterface>>( [] )
  // const [rsUsuarioGrupos, setRsUsuarioGrupos] = useState<Array<GrupoInterface>>( [] )

  const contexto = useContext( ContextoGlobal ) as ContextoGlobalInterface
  const { mensagemState, setMensagemState } = contexto

  const Cabecalho: Array<DataTableCabecalhoInterface> = [
    {
      campo: 'descricao',
      cabecalho: 'Descrição',
      alinhamento: 'left'
    }
  ]

  const btExcluirGrupo = ( grupo: GrupoInterface ) => {

    const mutation = `
        excluirGrupoUsuario(idUsuario: ${dados.idUsuario}, idGrupo: ${grupo.idGrupo}) {
          ok
          mensagem
        }
      `

    clsApi.mutation<RespostaPadraoInterface>( mutation, 'excluirGrupoUsuario', 'Excluindo Grupo...', contexto ).then( rs => {

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
      getUsuarioGrupos(idUsuario: ${dados.idUsuario}) {
        idGrupo
        descricao
      }
    `

    clsApi.query<Array<GrupoInterface>>( query, 'getUsuarioGrupos', 'Recebendo Grupos...', contexto, abortController ).then( rsGrupos => {

      setRsGrupos( rsGrupos )

    } ).catch( () => {

      setMensagemState( {
        ...mensagemState,
        titulo: 'Erro! Consulte Suporte!',
        exibir: true,
        mensagem: 'Erro ao Consultar Grupos de Usuários!',
        tipo: MensagemTipo.Error,
        exibirBotao: true
      } )

    } )
  }

  useEffect( () => {

    if ( [StatusForm.EditandoGrupos].includes( statusForm ) ) {

      pesquisarUsuarioGrupos()

    }

    return () => {

      abortController.abort()

    }

    //eslint-disable-next-line
  }, [dados, statusForm] )

  const [novoGrupo, setNovoGrupo] = useState<GrupoInterface | null>( null )

  const novoGrupoSelecionado = ( v: GrupoInterface | null ) => {

    setNovoGrupo( v )

    if ( v ) {

      const mutation = `
        incluirGrupoUsuario(idUsuario: ${dados.idUsuario}, idGrupo: ${v.idGrupo}) {
          ok
          mensagem
        }
      `

      clsApi.mutation<RespostaPadraoInterface>( mutation, 'incluirGrupoUsuario', 'Incluindo Grupo...', contexto ).then( rs => {

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
      <Condicional condicao={[StatusForm.EditandoGrupos].includes( statusForm )}>
        <Grid item xs={12}>
          <ShowText dados={dados} field='nome' label='Nome' />
        </Grid>

        <Grid item xs={12}>

          <SearchText
            onChange={novoGrupoSelecionado}
            objQuery='{idGrupo, descricao}'
            campoPesquisa='descricao'
            campoID='idGrupo'
            label='Adicionar Grupo'
            value={novoGrupo}
            mensagemQuery='Procurando Grupos...'
            campoQuery='pesquisa'
            nomeQuery='getGrupos'
          />

        </Grid>

        <Grid item xs={12} sx={{ mt: 3 }}>

          <Typography component="h6" variant="h6" align="left">
            Grupos Ativos Para Este Usuário
          </Typography>

          <DataTable
            dados={rsGrupos}
            cabecalho={Cabecalho}
            acoes={[{ icone: 'delete', toolTip: 'Retirar Usuário do Grupo', onAcionador: btExcluirGrupo }]}
          />

        </Grid>

        <Grid item xs={12} sx={{ mt: 3, textAlign: 'right' }}>

          <Button variant='contained' startIcon={<CloseIcon />} sx={{ py: 1 }} onClick={() => onCancelar()}>Cancelar</Button>

        </Grid>

      </Condicional>
    </>
  )

}