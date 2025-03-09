import React, { useState, useContext, useEffect } from 'react'
import {
  Select,
  SelectChangeEvent,
  Typography,
  FormControl,
  MenuItem,
  Checkbox,
  ListItemText,
  useTheme,
  InputAdornment,
  IconButton
} from '@mui/material'
import BackEndAPI from '../Services/BackEndAPI'
import { ContextoGlobal, ContextoGlobalInterface } from '../GlobalStates/ContextoGlobal'

import CloseIcon from '@mui/icons-material/Close'
import Condicional from '../Layout/Condicional'

type TipoRegistroType = { [key: string]: string | number | readonly string[] | undefined | any }

export interface pesquisaInicialInterface {
  pesquisa: string
  tipo: 'Query' | 'Mutation'
  objRetorno: string
  mensagem: string
}

export interface selectMultiploPropsInterface {
  /* Label do Campo (Acima do texto) */
  label: string
  /* State para setup dos dados */
  setState: React.Dispatch<React.SetStateAction<any>>
  /* Dados Originais */
  dados: TipoRegistroType,
  /* Campo dentro do State a ser Setado */
  field: string,
  /* Campo do rsSelect a ser usado como ID - será atribuido a field na forma de array */
  fieldIdSelect: string,
  /* Campo do rsSelect a ser usado como Pesquisa / Descrição */
  fieldSelect: string,
  /* RecordSet contendo os dados para seleção */
  rsSelect?: Array<TipoRegistroType>,
  /* Objeto Erros */
  erros?: { [key: string]: string },
  disabled?: boolean
  onChange?: ( v: any ) => void
  pesquisaInicial?: pesquisaInicialInterface | undefined
  /* Permite Seleção Múltipla */
}

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
    },
  },
}

export default function XXXXX_SelectMultiplo ( {
  label,
  setState,
  dados,
  field,
  fieldIdSelect,
  fieldSelect,
  rsSelect,
  erros = {},
  disabled = false,
  onChange = undefined,
  pesquisaInicial
}: selectMultiploPropsInterface ) {

  const theme = useTheme()

  const abortController: AbortController = new AbortController()

  const contexto: ContextoGlobalInterface = ( useContext( ContextoGlobal ) as ContextoGlobalInterface )

  const clsApi = new BackEndAPI()

  const [rsPesquisa, setRsPesquisa] = useState<Array<TipoRegistroType>>( [] )

  useEffect( () => {

    if ( pesquisaInicial ) {

      if ( pesquisaInicial.tipo === 'Query' ) {

        clsApi.query<Array<TipoRegistroType>>( pesquisaInicial.pesquisa, pesquisaInicial.objRetorno, pesquisaInicial.mensagem, contexto ).then( rs => {
          setRsPesquisa( rs )
        } )

      } else {

        clsApi.mutation<Array<TipoRegistroType>>( pesquisaInicial.pesquisa, pesquisaInicial.objRetorno, pesquisaInicial.mensagem, contexto ).then( rs => {
          setRsPesquisa( rs )
        } )

      }

    } else if ( rsSelect ) {
      setRsPesquisa( rsSelect )
    }

    return () => {

      abortController.abort()

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] )

  const handleChange = ( event: SelectChangeEvent<typeof dados> ) => {
    const {
      target: { value },
    } = event

    if ( onChange ) {
      onChange( value )
    } else {
      setState( { ...dados, [field]: ( value as Array<string | number> ).sort() } )
    }

  }

  const renderDescricao = ( selecoes: Array<String | Number> ) => {
    let retorno: string = ''

    rsPesquisa.forEach( v => {

      if ( selecoes.findIndex( ( sel ) => sel === v[fieldIdSelect] ) >= 0 ) {
        if ( retorno.length > 0 )
          retorno = retorno.concat( ', ' )

        retorno = retorno.concat( v[fieldSelect] )
      }

    } )

    return retorno
  }

  return (
    <>
      <FormControl sx={{ width: '100%' }}>
        <Typography
          variant='body2'
          textAlign='left'
          sx={{ mt: theme.inputs.marginTop }}
        >
          {label}
        </Typography>

        <Select
          multiple
          sx={{ width: '100%', height: '40px' }}
          endAdornment={
            <InputAdornment position="start">
              <IconButton sx={{ mr: 1 }} onClick={() => handleChange( { target: { value: [] } } as any )}>
                <CloseIcon />
              </IconButton>
            </InputAdornment>

          }

          labelId="idSelectMultiplo"
          id="idSelectSelectMultiplo"
          // value={dados && dados[field] && dados[field].length > 0 ? dados[field] : ''}
          value={dados[field]}
          onChange={handleChange}
          disabled={disabled}
          renderValue={( selected ) => renderDescricao( selected as unknown as Array<String | Number> )}
          MenuProps={MenuProps}
        >
          {rsPesquisa.map( ( registro, indice ) => (
            <MenuItem key={indice} value={registro[fieldIdSelect]}>
              <Checkbox checked={dados[field].includes( registro[fieldIdSelect] )} />
              <ListItemText primary={registro[fieldSelect]} />
            </MenuItem>
          ) )}
        </Select>

        <Condicional condicao={typeof erros[field] !== 'undefined'}>
          <Typography variant='caption' textAlign='left' color='warning.main' >{erros[field]}</Typography>
        </Condicional>

      </FormControl >
    </>
  )

}