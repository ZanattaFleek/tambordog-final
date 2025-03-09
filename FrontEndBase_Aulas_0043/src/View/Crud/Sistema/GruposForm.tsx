import React from 'react'
import Condicional from '../../../Layout/Condicional'
import { StatusForm } from './Grupos'
import { Button, Grid } from '@mui/material'
import InputText from '../../../DevComponents/InputText'
import { GrupoInterface } from '../../../ImportBackend/Interfaces/GrupoInterfaces'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'

interface PropsInterface {
  statusForm: StatusForm
  dados: GrupoInterface
  setDados: React.Dispatch<React.SetStateAction<GrupoInterface>>
  erros: { [key: string]: string }
  btCancelar: ( arg?: any ) => void
  btConfirmar: ( arg?: any ) => void
  btConfirmarExclusao: ( arg?: any ) => void
}

export default function GruposForm ( {
  statusForm,
  dados,
  setDados,
  erros,
  btCancelar,
  btConfirmar,
  btConfirmarExclusao
}: PropsInterface ) {

  return (
    <Condicional condicao={[StatusForm.Incluindo, StatusForm.Editando, StatusForm.Excluindo].includes( statusForm )}>

      <Grid item xs={12} sm={10}>
        <InputText
          dados={dados}
          field='descricao'
          label='Descrição'
          setState={setDados}
          disabled={statusForm === StatusForm.Excluindo}
          erros={erros}
          maxLength={30}
        />
      </Grid>

      <Grid item xs={12} sx={{ mt: 3 }}>

        <Condicional condicao={statusForm === StatusForm.Excluindo}>
          <Button variant='contained' startIcon={<CheckIcon />} sx={{ my: 1, py: 1, mr: 2 }} onClick={() => btConfirmarExclusao()}>Excluir</Button>
        </Condicional>

        <Condicional condicao={statusForm !== StatusForm.Excluindo}>
          <Button variant='contained' startIcon={<CheckIcon />} sx={{ my: 1, py: 1, mr: 2 }} onClick={() => btConfirmar()}>Confirmar</Button>
        </Condicional>

        <Button variant='contained' startIcon={<CloseIcon />} sx={{ py: 1 }} onClick={() => btCancelar()}>Cancelar</Button>

      </Grid>

    </Condicional>

  )

}