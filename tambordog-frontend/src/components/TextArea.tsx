import React, { forwardRef } from 'react'
import FormControl from '@mui/material/FormControl'
import { OutlinedInput, Typography, IconButton, InputAdornment, Icon } from '@mui/material'
import Condicional from '../Layout/Condicional'
import { useTheme } from '@mui/material'

interface mapKeyPressInterface {
  key: string
  onKey: () => void
}

interface TextAreaInterface {
  label: string,
  disabled?: boolean,
  type?: string,
  min?: number | null,
  max?: number | null,
  scale?: number | null,
  placeholder?: string,
  dados: { [key: string]: string | number | readonly string[] | undefined | any },
  erros?: { [key: string]: string },
  field: string,
  setState?: React.Dispatch<React.SetStateAction<any>>
  iconeEnd?: string,
  onClickIconeEnd?: () => void
  iconeStart?: string
  onClickIconeStart?: () => void
  mapKeyPress?: Array<mapKeyPressInterface>
  tipo?: 'uppercase'
  maxLength?: number | null
  mask?: 'tel' | 'cnpj' | 'cpf' | 'cep' | 'uf' | 'mac' | string
  autoFocus?: boolean
  unmask?: boolean
  onChange?: ( v: string ) => void
  afterChange?: ( v: any ) => void
  onFocus?: ( v: any ) => void
  textAlign?: 'left' | 'right' | 'center',
  width?: '100%' | string
  height?: string
  labelPlacement?: 'top' | 'start' | 'end' | 'bottom',
}

const exibirIcone = ( posicao: 'start' | 'end', icone: string, onclick: () => void ) => {
  if ( icone.length > 0 ) {
    return (
      <InputAdornment position={posicao} sx={{ margin: 0, padding: 0 }}>
        <IconButton sx={{ margin: 0, padding: 0 }} onClick={() => {
          if ( onclick ) {
            onclick()
          }
        }}>
          <Icon sx={{ margin: 0, padding: 0 }}>{icone}</Icon>
        </IconButton>
      </InputAdornment>
    )
  }
}

const onKey = ( key: string, mapKeyPress: Array<mapKeyPressInterface> ) => {
  if ( mapKeyPress.length > 0 ) {
    let encontrou: boolean = false
    for ( let contador: number = 0; contador < mapKeyPress.length && !encontrou; contador++ ) {
      if ( mapKeyPress[contador].key === key ) {
        encontrou = true
        mapKeyPress[contador].onKey()
      }
    }
  }
}

export default function TextArea (
  { label,
    dados,
    field,
    setState = () => { },
    disabled = false,
    type = "text",
    placeholder = label,
    iconeStart = '',
    onClickIconeStart = () => { },
    iconeEnd = '',
    onClickIconeEnd = () => { },
    mapKeyPress = [],
    tipo = undefined,
    erros = {},
    autoFocus = false,
    onChange = undefined,
    afterChange = undefined,
    onFocus = undefined,
    textAlign = 'left',
    width = '100%',
    height = '25px',
    maxLength = 65535,
  }: TextAreaInterface ) {

  const theme = useTheme()

  let valor: string = dados[field]

  return (
    <FormControl sx={{ width: width }}>
      <Typography
        variant='body1'
        textAlign='left'
        sx={{ mt: theme && theme.inputs && theme.inputs.marginTop ? theme.inputs.marginTop : 0 }}
      >
        {label}
      </Typography>
      <OutlinedInput
        name={field}
        autoFocus={autoFocus}
        value={valor === null ? '' : valor}
        placeholder={placeholder}
        disabled={disabled}
        type={type}
        onFocus={( e ) => {
          if ( onFocus ) {
            onFocus( e )
          }
        }}
        onChange={( e ) => {

          const alterado: boolean = dados[field] !== e.target.value

          if ( alterado ) {

            let novoValor: string = ''

            novoValor = tipo === 'uppercase' ? e.target.value.toUpperCase() : e.target.value

            if ( onChange ) {

              onChange( novoValor )

            } else {

              const novoState = {
                ...dados,
                [field]: novoValor
              }

              setState( novoState )

              if ( afterChange ) {
                afterChange( novoState )
              }

            }

          }
        }}
        endAdornment={exibirIcone( 'end', iconeEnd, onClickIconeEnd )}
        startAdornment={exibirIcone( 'start', iconeStart, onClickIconeStart )}
        onKeyDown={( ev ) => onKey( ev.key, mapKeyPress )}
        inputProps={{
          style: { textAlign: textAlign, height: height },
          tipo: tipo,
          maxLength: maxLength,
        }}
        inputComponent={'textarea'}
      />
      <Condicional condicao={typeof erros[field] !== 'undefined'}>
        <Typography variant='caption' textAlign='left' color='warning.main' >{erros[field]}</Typography>
      </Condicional>

    </FormControl>
  )

}
