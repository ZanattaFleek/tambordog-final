import React, { useEffect, useState } from 'react'

import { Button, Container, Dialog, Grid, IconButton, Paper, Typography } from '@mui/material'
import { StatusForm } from '../../../DevComponents/DataTableCrudJSON'

import ClsValidacao from '../../../Utils/ClsValidacao'

import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'
import InputText from '../../../DevComponents/InputText'
import Condicional from '../../../Layout/Condicional'
import { AtualizacaoCadastroProdutorCulturaInterface } from '../../../ImportBackend/Interfaces/AtualizacaoCadastroInterfaces'

interface PropsInterface<T> {
  onConfirmarExclusao: () => void
  onConfirmarEdicaoInclusao: ( registro: AtualizacaoCadastroProdutorCulturaInterface ) => void
  onCancelar: () => void
  open: boolean
  statusForm: StatusForm
  registro: AtualizacaoCadastroProdutorCulturaInterface
  titulo: string
  dadosIniciaisRegistro: T
}

export default function AtualizacaoCadastroProdutorCulturaJSON<T> ( {
  onConfirmarExclusao,
  onConfirmarEdicaoInclusao,
  onCancelar,
  open,
  statusForm,
  registro,
  titulo
}: PropsInterface<T> ) {

  const TituloForm = {
    [StatusForm.Incluindo]: 'Inclusão de Nova Cultura',
    [StatusForm.Excluindo]: 'Exclusão de Cultura',
    [StatusForm.Exibindo]: 'Cultura',
    [StatusForm.Editando]: 'Alteração de Dados de Cultura',
    [StatusForm.Inicial]: 'Dados de Cultura',
  }

  const [dados, setDados] = useState<AtualizacaoCadastroProdutorCulturaInterface>( { ...registro } )

  useEffect( () => {
    setDados( { ...registro } )
  }, [registro] )

  const [erros, setErros] = useState( {} )

  const validarDados = (): boolean => {

    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    let clsValidacao = new ClsValidacao()

    retorno = clsValidacao.naoVazio( 'safra', dados, erros, retorno )
    retorno = clsValidacao.naoVazio( 'cultura', dados, erros, retorno )
    retorno = clsValidacao.naoVazio( 'area', dados, erros, retorno )
    retorno = clsValidacao.naoVazio( 'materialPlantado', dados, erros, retorno )

    setErros( erros )

    return retorno

  }

  const btConfirmar = () => {

    if ( validarDados() ) {
      onConfirmarEdicaoInclusao( dados )
    }

  }

  return (
    <Dialog open={open} onClose={onCancelar}>

      <Container maxWidth="md" sx={{ my: 3 }}>

        <Paper variant="outlined" sx={{ padding: 2 }}>
          <Grid container sx={{ display: 'flex', alignItems: 'stretch' }}>

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography component="h5" variant="h5" align="left">
                {titulo}
                <Typography variant="body2" gutterBottom>
                  {TituloForm[statusForm]}
                </Typography>
              </Typography>

              <IconButton onClick={() => onCancelar()}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>

          <Grid item xs={12}>

            <InputText
              dados={dados}
              field='safra'
              label='Safra'
              setState={setDados}
              disabled={![StatusForm.Editando, StatusForm.Incluindo].includes( statusForm )}
              erros={erros}
              tipo='uppercase'
            />

          </Grid>

          <Grid item xs={12}>

            <InputText
              dados={dados}
              field='cultura'
              label='Cultura'
              setState={setDados}
              disabled={![StatusForm.Editando, StatusForm.Incluindo].includes( statusForm )}
              erros={erros}
              tipo='uppercase'
            />

          </Grid>

          <Grid item xs={12}>

            <InputText
              dados={dados}
              field='materialPlantado'
              label='Tipo de Material Plantado'
              setState={setDados}
              disabled={![StatusForm.Editando, StatusForm.Incluindo].includes( statusForm )}
              erros={erros}
              tipo='uppercase'
            />

          </Grid>

          <Grid item xs={12}>

            <InputText
              dados={dados}
              field='area'
              label='Área'
              setState={setDados}
              disabled={![StatusForm.Editando, StatusForm.Incluindo].includes( statusForm )}
              erros={erros}
              tipo='currency'
            />

          </Grid>

          <Grid item xs={12} sx={{ mt: 3 }}>

            <Condicional condicao={![StatusForm.Editando, StatusForm.Incluindo].includes( statusForm )}>
              <Button variant='contained' startIcon={<CheckIcon />} sx={{ my: 1, py: 1, mr: 2 }} onClick={() => onConfirmarExclusao()}>Confirmar</Button>
            </Condicional>

            <Condicional condicao={statusForm !== StatusForm.Excluindo}>
              <Button variant='contained' startIcon={<CheckIcon />} sx={{ my: 1, py: 1, mr: 2 }} onClick={() => btConfirmar()}>Confirmar</Button>
            </Condicional>

            <Button variant='contained' startIcon={<CloseIcon />} sx={{ py: 1 }} onClick={() => onCancelar()}>Cancelar</Button>

          </Grid>

        </Paper>
      </Container>

    </Dialog>
  )

}