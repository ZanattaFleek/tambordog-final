import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import InputText from '../../../DevComponents/InputText'
import { UsuarioInterface } from '../../../ImportBackend/Interfaces/UsuarioInterfaces'
import Condicional from '../../../Layout/Condicional'
import { StatusForm } from './Usuarios'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import ClsValidacao from '../../../Utils/ClsValidacao'
import ShowText from '../../../DevComponents/ShowText'

interface PropsInterface {
  statusForm: StatusForm
  dados: UsuarioInterface
  onConfirmar: ( idUsuario: number, senha: string ) => void
  onCancelar: () => void
}

export default function UsuariosAtribuirSenha ( { statusForm, dados, onConfirmar, onCancelar }: PropsInterface ) {

  const [senha, setSenha] = useState( { senha: '' } )
  const [erros, setErros] = useState( {} )

  const [tipo, setTipo] = useState( 'text' )

  const btConfirmar = () => {
    if ( validarDados() ) {
      onConfirmar( ( dados.idUsuario as number ), senha.senha )
    }
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    let clsValidacao = new ClsValidacao()

    retorno = clsValidacao.tamanho( 'senha', senha, erros, retorno, false, 6, 30, 'Campo Senha Deve ter Entre 6 e 30 caracteres.' )

    setErros( erros )

    return retorno

  }

  return (
    <>
      <Condicional condicao={[StatusForm.AtribuindoSenha].includes( statusForm )}>
        <Grid item xs={12} sm={6}>
          <ShowText dados={dados} field='nome' label='Nome' />
        </Grid>

        <Grid item xs={12} sm={6} sx={{ pl: { sm: 2 } }}>

          <InputText
            dados={senha}
            field='senha'
            label='Senha'
            setState={setSenha}
            disabled={statusForm === StatusForm.Excluindo}
            erros={erros}
            maxLength={30}
            iconeEnd='visibility'
            type={tipo}
            onClickIconeEnd={() => setTipo( tipo === 'text' ? 'password' : 'text' )}
          />

        </Grid>

        <Grid item xs={12} sx={{ mt: 3 }}>

          <Button variant='contained' startIcon={<CheckIcon />} sx={{ my: 1, py: 1, mr: 2 }} onClick={() => btConfirmar()}>Confirmar</Button>

          <Button variant='contained' startIcon={<CloseIcon />} sx={{ py: 1 }} onClick={() => onCancelar()}>Cancelar</Button>

        </Grid>

      </Condicional>
    </>
  )

}