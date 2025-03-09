import React, { useState } from 'react'

import { ListItem, ListItemButton, ListItemIcon, ListItemText, Switch } from '@mui/material'

import Collapse from '@mui/material/Collapse'

import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { QuerySistemaModuloPermissaoInterface, SistemaModuloInterface } from '../../../ImportBackend/Interfaces/SistemaModuloPermissaoInterfaces';
import BackEndAPI from '../../../Services/BackEndAPI';
import { ContextoGlobalInterface } from '../../../GlobalStates/ContextoGlobal';
import { MensagemTipo } from '../../../GlobalStates/MensagemState';
import { RespostaPadraoInterface } from '../../../ImportBackend/Interfaces/PadraoInterfaces';

interface PropsInterface {
  clsApi: BackEndAPI
  contexto: ContextoGlobalInterface
  rsSistemaModulo: SistemaModuloInterface
  idGrupo: number
}


export default function GruposPermissoesList ( { idGrupo, clsApi, contexto, rsSistemaModulo }: PropsInterface ) {

  const [open, setOpen] = useState( false )

  const [carregado, setCarregado] = useState( false )

  const { mensagemState, setMensagemState } = contexto

  const [rsPermissoes, setRsPermissoes] = useState<Array<QuerySistemaModuloPermissaoInterface>>( [] )

  const setarPermissao = ( idModulo: number, idSistemaPermissao: number, indice: number ) => {

    const mutation = `
        setSistemaModuloPermissoesPorGrupo( idSistemaPermissao: ${idSistemaPermissao}, 
                                            idGrupo: ${idGrupo},
                                            permitido: ${!rsPermissoes[indice].permitido}
                                          ) 
        {
          ok
          mensagem
        }
    `

    clsApi.mutation<RespostaPadraoInterface>( mutation, 'setSistemaModuloPermissoesPorGrupo', 'Atualizando Permissões...', contexto ).then( rs => {

      if ( rs.ok ) {

        let tmp: Array<QuerySistemaModuloPermissaoInterface> = [...rsPermissoes]

        tmp[indice].permitido = !tmp[indice].permitido

        setRsPermissoes( [...tmp] )

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

  const openPermissoes = ( idModulo: number ) => {
    if ( !open && !carregado ) {

      const query = `
        getSistemaModuloPermissoesPorGrupo(idModulo: ${idModulo}, idGrupo: ${idGrupo}) {
          idSistemaPermissao
          descricao
          permitido
        }
      `

      clsApi.query<Array<QuerySistemaModuloPermissaoInterface>>( query, 'getSistemaModuloPermissoesPorGrupo', 'Pesquisando Permissões...', contexto ).then( rsSistemaModuloPermissoes => {
        setRsPermissoes( rsSistemaModuloPermissoes )
        setOpen( true )
        setCarregado( true )

      } ).catch( ( e ) => {

        setMensagemState( {
          ...mensagemState,
          titulo: 'Erro ao Consultar Permissões!',
          exibir: true,
          mensagem: e.message,
          tipo: MensagemTipo.Error,
          exibirBotao: true
        } )

      } )

    } else {
      setOpen( !open )
    }

  }


  return (
    <>
      <ListItemButton
        selected={open}
        onClick={() => openPermissoes( rsSistemaModulo.idModulo )}
      >
        <ListItemIcon>
          {open ? <FolderOpenIcon /> : <FolderIcon />}
        </ListItemIcon>
        <ListItemText primary={rsSistemaModulo.descricao} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit sx={{ ml: 3, mr: 6 }}>

        {rsPermissoes.map( ( rsPermissao, indice ) =>

          <ListItem key={indice}>
            <ListItemIcon>
              <KeyboardArrowRightIcon />
            </ListItemIcon>
            <ListItemText id="switch-list-label-wifi" primary={rsPermissao.descricao} />

            <Switch
              edge="end"
              onChange={() => setarPermissao( rsSistemaModulo.idModulo, rsPermissao.idSistemaPermissao, indice )}
              inputProps={{
                'aria-labelledby': 'switch-list-label-wifi',
              }}
              checked={rsPermissao.permitido}
            />
          </ListItem>

        )}

      </Collapse>
    </>
  )

}