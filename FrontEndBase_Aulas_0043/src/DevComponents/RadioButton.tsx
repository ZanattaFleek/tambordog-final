import React, { forwardRef } from 'react'
import FormControl from '@mui/material/FormControl'
import { Typography, RadioGroup, Radio, FormHelperText, OutlinedInput, useTheme } from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel'

interface RadioButtonInterface {
  label: string,
  dados: { [key: string]: string | number | readonly string[] | undefined | any },
  field: string,
  setState: React.Dispatch<React.SetStateAction<any>>
  disabled?: boolean,
  erros?: { [key: string]: string },
  onChange?: ( v: any ) => void
  opcoes: Array<any>
  campoID: string
  campoDescricao: string
  tipo?: 'number' | 'text'
  row?: boolean
}

const RadioButtonCustom = forwardRef( ( props: any, ref: any ) => {

  const {
    opcoes,
    campoID,
    campoDescricao,
    disabled,
    row,
    ...other
  } = props;

  return (
    <RadioGroup
      {...other}
      row={row}
      sx={{
        '& .MuiSvgIcon-root': {
          fontSize: 25,
        },
      }}
    >

      {opcoes.map( ( opcao: any, index: number ) =>
        <FormControlLabel sx={{ mt: -1 }} key={index} value={opcao[campoID]} control={<Radio disabled={disabled} />} label={<Typography variant='body1' sx={{ ma: 0, pa: 0 }}>{opcao[campoDescricao]}</Typography>} />
      )}

    </RadioGroup>
  )
} )

export default function RadioButton (
  { label,
    dados,
    field,
    setState,
    campoID,
    campoDescricao,
    opcoes,
    disabled = false,
    erros = {},
    onChange = undefined,
    tipo = 'text',
    row = false
  }: RadioButtonInterface ) {

  const theme = useTheme()

  return (
    <FormControl sx={{ width: '100%' }}>
      <Typography
        variant='body2'
        textAlign='left'
        sx={{ mt: theme && theme.inputs && theme.inputs.marginTop ? theme.inputs.marginTop : 0 }}
      >
        {label}
      </Typography>
      <OutlinedInput
        aria-labelledby="buttons-group-label"
        name="radio-buttons-group"
        value={dados[field]}
        sx={{ height: '40px' }}
        onChange={( e ) => {

          const alterado: boolean = ( typeof dados[field] === 'number' && dados[field].toString() !== e.target.value )
            || dados[field] !== e.target.value

          if ( alterado ) {

            let novoValor: number | string = tipo === 'number' ? parseInt( e.target.value ) :
              e.target.value

            if ( onChange ) {

              onChange( novoValor )

            } else {

              setState( {
                ...dados,
                [field]: novoValor
              } )

            }

          }
        }
        }
        inputProps={{
          opcoes: opcoes,
          campoID: campoID,
          campoDescricao: campoDescricao,
          disabled: disabled,
          row: row
        }}

        inputComponent={RadioButtonCustom}

      />

      <FormHelperText>{erros[field]}</FormHelperText>
    </FormControl>
  )

}
