import React from 'react';
import FormControl from '@mui/material/FormControl';
import { OutlinedInput, Typography, IconButton, InputAdornment, Icon } from '@mui/material';
import Checkbox from '@mui/material/Checkbox/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

interface ShowTextInterface {
  label: string,
  dados: { [key: string]: string | number | readonly string[] | undefined | any },
  type?: string,
  placeholder?: string,
  field: string,
  iconeEnd?: string,
  onClickIconeEnd?: () => void
  iconeStart?: string
  onClickIconeStart?: () => void
  tipo?: 'text' | 'checkbox'
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

export default function ShowText (
  { label,
    dados,
    field,
    type = "text",
    placeholder = label,
    iconeStart = '',
    onClickIconeStart = () => { },
    iconeEnd = '',
    onClickIconeEnd = () => { },
    tipo = 'text',
  }: ShowTextInterface ) {

  if ( tipo === 'checkbox' ) {
    return (
      <>
        <FormControlLabel
          sx={{ width: '100%' }}
          label={label}
          control={
            <Checkbox
              checked={dados[field]}
              disabled
            />
          }
        />
      </>
    )
  } else if ( tipo === 'text' ) {

    return (
      <FormControl sx={{ width: '100%' }}>
        <Typography
          variant='body2'
          textAlign='left'
          sx={{ mt: 1 }}
        >
          {label}
        </Typography>
        <OutlinedInput
          value={dados[field] || ''}
          sx={{ my: 0, py: 0, height: 40 }}
          placeholder={placeholder}
          disabled
          type={type}
          endAdornment={exibirIcone( 'end', iconeEnd, onClickIconeEnd )}
          startAdornment={exibirIcone( 'start', iconeStart, onClickIconeStart )}
        />
      </FormControl>
    )

  } else {
    return ( <></> )
  }

}
