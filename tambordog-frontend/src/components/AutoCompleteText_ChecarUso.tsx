import React from 'react'
import Autocomplete from '@mui/material/Autocomplete/Autocomplete'
import TextField from '@mui/material/TextField/TextField'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material'

export interface autoCompleteDadosInterface {
  id: number
  pesquisa: string
}

export interface searchTextPropsInterface {
  freeSolo?: boolean
  label: string
  dados: Array<{ [key: string]: string | number | readonly string[] | undefined | any }>,
  campoPesquisa: string
  value: { [key: string]: string | number | readonly string[] | undefined | any }
  setValue: React.Dispatch<any>
}

export default function SearchText ( { value, setValue, label, freeSolo = true, dados, campoPesquisa }: searchTextPropsInterface ) {

  const theme = useTheme()

  return (
    <>
      <Autocomplete
        value={value}
        disablePortal
        id="combo-box-demo"
        getOptionLabel={( opcao ) => opcao.cidade ?? opcao}
        onChange={( e, v ) => setValue( v )}
        isOptionEqualToValue={( opcao, valor ) => JSON.stringify( opcao ) === JSON.stringify( valor )}
        options={dados}
        renderInput={( params ) =>
          <FormControl sx={{ width: '100%' }}>
            <Typography
              variant='body2'
              textAlign='left'
              sx={{ mt: theme.inputs.marginTop }}
            >
              {label}
            </Typography>
            <TextField {...params} size="small" />
          </FormControl>
        }
      />
    </>
  )

}