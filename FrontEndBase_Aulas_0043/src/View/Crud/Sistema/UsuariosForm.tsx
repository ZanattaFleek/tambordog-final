import React from 'react'
import Condicional from '../../../Layout/Condicional'
import { StatusForm } from './Usuarios'
import { Button, Grid } from '@mui/material'
import InputText from '../../../DevComponents/InputText'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import RadioButton from '../../../DevComponents/RadioButton'
import { UsuarioInterface } from '../../../ImportBackend/Interfaces/UsuarioInterfaces'
import { TipoClienteType, TipoClienteTypes } from '../../../ImportBackend/types/ConstantesDataTypes'


interface PropsInterface {
  statusForm: StatusForm
  dados: UsuarioInterface
  setDados: React.Dispatch<React.SetStateAction<UsuarioInterface>>
  erros: { [key: string]: string }
  btCancelar: ( arg?: any ) => void
  btConfirmar: ( arg?: any ) => void
  btConfirmarExclusao: ( arg?: any ) => void
  pesquisarCpfCnpj: ( arg: string ) => void
}

export default function UsuariosForm ( {
  statusForm,
  dados,
  setDados,
  erros,
  btCancelar,
  btConfirmar,
  btConfirmarExclusao,
  pesquisarCpfCnpj
}: PropsInterface ) {

  return (
    <Condicional condicao={[StatusForm.Incluindo, StatusForm.Editando, StatusForm.Excluindo].includes( statusForm )}>

      <Grid item xs={12} sm={10}>
        <InputText
          dados={dados}
          field='nome'
          label='Nome'
          setState={setDados}
          disabled={statusForm === StatusForm.Excluindo}
          erros={erros}
          maxLength={40}
        />
      </Grid>

      <Grid item xs={12} sm={2} sx={{ pl: { sm: 2 } }}>
        <InputText
          dados={dados}
          field='ativo'
          label='Ativo'
          setState={setDados}
          tipo='checkbox'
          disabled={statusForm === StatusForm.Excluindo}
          erros={erros}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <InputText
          dados={dados}
          field='login'
          label='Login'
          setState={setDados}
          disabled={statusForm === StatusForm.Excluindo}
          erros={erros}
          maxLength={30}
          mask='llllllllllllllllllllllllllllll'
        />
      </Grid>

      <Grid item xs={12} sm={6} sx={{ pl: { sm: 2 } }}>
        <InputText
          dados={dados}
          field='whatsApp'
          label='Whats App'
          setState={setDados}
          disabled={statusForm === StatusForm.Excluindo}
          erros={erros}
          maxLength={15}
          mask='tel'
        />
      </Grid>

      <Grid item xs={12}>
        <InputText
          dados={dados}
          field='email'
          label='e-mail'
          setState={setDados}
          disabled={statusForm === StatusForm.Excluindo}
          erros={erros}
          maxLength={255}
        />
      </Grid>

      <Grid item xs={12}>
        <RadioButton
          campoID='idTipoCliente'
          campoDescricao='descricao'
          opcoes={TipoClienteTypes}
          dados={dados}
          erros={erros}
          field='tipo'
          setState={setDados}
          label='Tipo do Cliente'
          disabled={statusForm === StatusForm.Excluindo}
          row
        />

      </Grid>

      <Grid item xs={12} sm={4} md={3}>

        <InputText
          dados={dados}
          field='cpfCnpj'
          label={dados.tipo === TipoClienteType.PJ ? 'CNPJ' : 'CPF'}
          setState={setDados}
          disabled={statusForm === StatusForm.Excluindo}
          erros={erros}
          maxLength={18}
          mask={dados.tipo === TipoClienteType.PJ ? 'cnpj' : 'cpf'}
          onChange={( v: string ) => pesquisarCpfCnpj( v )}
        />

      </Grid>

      <Grid item xs={12} sm={8} md={9} sx={{ pl: { sm: 1 } }}>

        <InputText
          dados={dados}
          field='nomeERP'
          label={dados.tipo === TipoClienteType.PJ ? 'Razão Social (ERP)' : 'Nome (ERP)'}
          setState={setDados}
          disabled={true}
          erros={erros}
          maxLength={50}
        />

      </Grid>

      <Grid item xs={12} sm={8} md={9} sx={{ pl: { sm: 1 } }}>

        <InputText
          dados={{ representante: dados.idRepresentante > 0 ? 'Sim' : 'Não' }}
          field='representante'
          label='Representante?'
          disabled={true}
          erros={erros}
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