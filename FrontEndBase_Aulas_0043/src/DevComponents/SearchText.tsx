import React, { useState, useContext, useEffect } from 'react'
import Autocomplete from '@mui/material/Autocomplete/Autocomplete'
import TextField from '@mui/material/TextField/TextField'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import { useTheme, IconButton } from '@mui/material'
import BackEndAPI from '../Services/BackEndAPI'
import { ContextoGlobal, ContextoGlobalInterface } from '../GlobalStates/ContextoGlobal'
import Condicional from '../Layout/Condicional'
import { MensagemTipo } from '../GlobalStates/MensagemState'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'

export interface autoCompleteDadosInterface {
  id: number
  pesquisa: string
}

// type dadosType = { [key: string]: string | number | readonly string[] | undefined | any }

export interface searchTextPropsInterface<T> {
  label: string
  campoPesquisa: string
  campoID: string
  value: T | null
  onSearch?: ( ( value: string ) => Promise<Array<T>> ) | null
  mensagemQuery: string
  campoQuery: string
  nomeQuery: string
  objQuery: string
  onChange: ( newValue: T | null ) => void
  erros?: { [key: string]: string },
  field?: string
  queryConsultaPrimeiroValor?: string
  nomeQueryConsultaPrimeiroValor?: string
  disabled?: boolean
}

export default function SearchText<T> ( {
  onSearch = null,
  nomeQuery = '',
  campoQuery = '',
  mensagemQuery = '',
  objQuery = '',
  value,
  label,
  campoPesquisa,
  campoID,
  onChange,
  erros = {},
  field = '',
  queryConsultaPrimeiroValor = '',
  nomeQueryConsultaPrimeiroValor = '',
  disabled = false
}: searchTextPropsInterface<T> ) {

  const contexto: ContextoGlobalInterface = ( useContext( ContextoGlobal ) as ContextoGlobalInterface )

  const [dados, setDados] = useState<Array<T>>( [] )

  const theme = useTheme()
  const clsApi = new BackEndAPI()

  const [pesquisa, setPesquisa] = useState( '' )

  const onClickSearch = () => {

    if ( onSearch ) {

      onSearch( pesquisa ).then( rs => {
        setDados( rs )
      } )

    } else {

      const query: string = `
        ${nomeQuery}(${campoQuery}: "${pesquisa}") ${objQuery}
      `

      clsApi.query<Array<T>>( query, nomeQuery, mensagemQuery, contexto ).then( rs => {
        setDados( rs )
      } )

    }

  }

  // Pesquisa Quando o campo já vem preenchido...

  const abortController: AbortController = new AbortController()

  useEffect( () => {

    if ( queryConsultaPrimeiroValor.length > 0 ) {

      clsApi.query<T>( queryConsultaPrimeiroValor, nomeQueryConsultaPrimeiroValor, 'Pesquisando...', contexto, abortController ).then( rs => {

        setDados( [rs] )
        onChange( rs )

      } ).catch( ( e ) => {
        console.log( e.message )

        contexto.setMensagemState( {
          ...contexto.mensagemState,
          titulo: 'Erro! Consulte Suporte!',
          exibir: true,
          mensagem: 'Erro ao Consultar Search Text!',
          tipo: MensagemTipo.Error,
          exibirBotao: true
        } )

      } )

    } else {
      setDados( [] )
    }

    return () => {

      abortController.abort()

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] )

  return (
    <>
      <Autocomplete

        filterOptions={( x ) => x}
        handleHomeEndKeys
        value={value}
        disablePortal
        disabled={disabled}
        id="combo-box-demo"
        getOptionLabel={( opcao: any ) => {
          return opcao[campoPesquisa] ?? ( typeof opcao === 'string' ? opcao : '' )
        }
        }
        onChange={( _e, v ) => {
          if ( onChange ) {
            onChange( v )
          }
        }}
        isOptionEqualToValue={
          ( _opcao, _valor ) => {
            return true
          }
        }
        options={dados}
        inputValue={pesquisa}
        onInputChange={( event: React.SyntheticEvent, value: string, reason: string ) => {
          if ( value ) { setPesquisa( value ) } else { setPesquisa( '' ) }
        }}
        renderOption={( props, option: any ) => {
          return (
            <li {...props} key={option[campoID]}>
              {option[campoPesquisa]}
            </li>
          )
        }}
        renderInput={( params ) =>
          <FormControl sx={{ width: '100%' }}>
            <Typography
              variant='body2'
              textAlign='left'
              sx={{ mt: theme.inputs.marginTop }}
            >
              {label}
            </Typography>
            <TextField {...params}

              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton onClick={() => onClickSearch()}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}

              size="small" onKeyDown={
                ( ev ) => {

                  if ( ev.key === 'Enter' ) {
                    onClickSearch()
                  }

                  return null

                }
              } />
            <Condicional condicao={typeof erros[field] !== 'undefined'}>
              <Typography variant='caption' textAlign='left' color='warning.main' >{erros[field]}</Typography>
            </Condicional>
          </FormControl>
        }
      />
    </>
  )

}