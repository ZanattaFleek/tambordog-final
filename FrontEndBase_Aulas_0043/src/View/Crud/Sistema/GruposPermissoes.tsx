import React, { useEffect, useState } from 'react'
import { Grid, List, Typography } from '@mui/material'
import ShowText from '../../../DevComponents/ShowText'
import { GrupoInterface } from '../../../ImportBackend/Interfaces/GrupoInterfaces'
import Condicional from '../../../Layout/Condicional'
import BackEndAPI from '../../../Services/BackEndAPI'
import { StatusForm } from './Grupos'

import CloseIcon from '@mui/icons-material/Close';

import Button from '@mui/material/Button'
import { SistemaModuloInterface } from '../../../ImportBackend/Interfaces/SistemaModuloPermissaoInterfaces'
import { ContextoGlobalInterface } from '../../../GlobalStates/ContextoGlobal'
import { MensagemTipo } from '../../../GlobalStates/MensagemState'
import GruposPermissoesList from './GruposPermissoesList'

interface PropsInterface {
  statusForm: StatusForm
  dados: GrupoInterface
  clsApi: BackEndAPI
  onCancelar: () => void
  contexto: ContextoGlobalInterface
}

export default function GruposPermissoes ( { clsApi, statusForm, dados, onCancelar, contexto }: PropsInterface ) {

  const { mensagemState, setMensagemState } = contexto

  const [rsSistemaModulo, setRsSistemaModulo] = useState<Array<SistemaModuloInterface>>( [] )

  const abortController: AbortController = new AbortController()

  useEffect( () => {
    const query = `
      getSistemaModulo(pesquisa: "") {
        idModulo
        descricao
      }
    `

    clsApi.query<Array<SistemaModuloInterface>>( query, 'getSistemaModulo', 'Pesquisando Permissões...', contexto, abortController ).then( rsSistemaModulos => {

      setRsSistemaModulo( rsSistemaModulos )

    } ).catch( ( e ) => {
      console.log( e.message )

      setMensagemState( {
        ...mensagemState,
        titulo: 'Erro! Consulte Suporte!',
        exibir: true,
        mensagem: 'Erro ao Consultar Permissões!',
        tipo: MensagemTipo.Error,
        exibirBotao: true
      } )

    } )

    return () => {

      abortController.abort()

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] )

  return (
    <>
      <Condicional condicao={[StatusForm.EditandoPermissoes].includes( statusForm )}>
        <Grid item xs={12}>
          <ShowText dados={dados} field='descricao' label='Descrição' />
        </Grid>

        <Grid item xs={12}>
          <List
            sx={{ width: '100%', bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <Typography sx={{ mt: 3 }} component="h6" variant="h6" align="left">
                Permissões de Grupos
              </Typography>
            }
          >

            {rsSistemaModulo.map( ( rsSistemaModulo, indice ) =>
              <GruposPermissoesList key={indice}
                clsApi={clsApi}
                contexto={contexto}
                rsSistemaModulo={rsSistemaModulo}
                idGrupo={dados.idGrupo as number}
              />
            )}
          </List>
        </Grid>

        <Grid item xs={12} sx={{ mt: 3, textAlign: 'right' }}>

          <Button variant='contained' startIcon={<CloseIcon />} sx={{ py: 1 }} onClick={() => onCancelar()}>Cancelar</Button>

        </Grid>


      </Condicional>
    </>
  )

}