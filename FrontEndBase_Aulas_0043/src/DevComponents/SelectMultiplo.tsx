import React, { useState, useContext, useEffect } from 'react'
import {
  TextField,
  Autocomplete,
  Typography,
  FormControl,
  Checkbox,
  useTheme
} from '@mui/material'
import BackEndAPI from '../Services/BackEndAPI'
import { ContextoGlobal, ContextoGlobalInterface } from '../GlobalStates/ContextoGlobal'

import Condicional from '../Layout/Condicional'

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'

type TipoRegistroType = { [key: string]: string | number | readonly string[] | undefined | any }

export interface pesquisaInicialInterface {
  pesquisa: string
  tipo: 'Query' | 'Mutation'
  objRetorno: string
  mensagem: string
}

export interface selectComObjetoInterface {
  campoId: string
}

export interface selectMultiploPropsInterface {
  /* Label do Campo (Acima do texto) */
  label?: string
  /* State para setup dos dados */
  setState?: React.Dispatch<React.SetStateAction<any>>
  /* Dados Originais */
  dados: TipoRegistroType,
  /* Campo dentro do State a ser Setado */
  field: string,
  /* Campo do rsSelect a ser usado como ID - será atribuido a field na forma de array */
  fieldIdSelect: string,
  /* Campo do rsSelect a ser usado como Pesquisa / Descrição */
  fieldSelect: string,
  /* RecordSet contendo os pré dados para seleção */
  rsSelect?: Array<TipoRegistroType>,
  /* Objeto Erros */
  erros?: { [key: string]: string },
  disabled?: boolean
  onChange?: ( v: any ) => void
  pesquisaInicial?: pesquisaInicialInterface | undefined
  /** Vetor com os campos a serem retornados no objeto - uso no setState */
  fieldsRetornoObjeto: Array<string>
}

export default function SelectMultiplo ( {
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
  pesquisaInicial,
  fieldsRetornoObjeto
}: selectMultiploPropsInterface ) {

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const theme = useTheme()

  const abortController: AbortController = new AbortController()

  const contexto: ContextoGlobalInterface = ( useContext( ContextoGlobal ) as ContextoGlobalInterface )

  const clsApi = new BackEndAPI()

  const [rsPesquisa, setRsPesquisa] = useState<Array<TipoRegistroType>>( [] )

  const [valorPesquisa, setValorPesquisa] = useState( '' )

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

  return (
    <>
      <div>
        <Autocomplete
          value={dados[field]}
          onChange={( _event, value: Array<Record<string, string | number>>, _reason, _details ) => {

            let retorno: Array<Record<string, string | number>> = []

            value.forEach( v => {
              let registro: Record<string, string | number> = {}

              fieldsRetornoObjeto.forEach( campo => {
                registro[campo] = v[campo]
              } )

              retorno.push( { ...registro } )

            } )

            if ( onChange ) {
              onChange( retorno )
            } else if ( setState ) {
              setState( { ...dados, [field]: retorno } )
            }
          }}
          isOptionEqualToValue={( option: any, value: any ) => {
            if ( typeof option == 'object' && typeof value == 'object' ) {
              return option[fieldIdSelect] === value[fieldIdSelect]
            } else if ( typeof option === 'object' ) {
              return option[fieldIdSelect] === value
            } else {
              return option === value
            }
          }}
          id="checkboxes-tags-demo"
          options={rsPesquisa}
          multiple
          disableCloseOnSelect
          getOptionLabel={( option ) => {
            if ( option[fieldSelect] ) {
              return option[fieldSelect]
            } else {
              const indice: number = rsPesquisa.findIndex( v => v[fieldIdSelect] === option[fieldIdSelect] )
              if ( indice >= 0 ) {
                return rsPesquisa[indice][fieldSelect]
              } else {
                return ""
              }
            }
          }}
          renderInput={( params ) =>
            <FormControl sx={{ width: '100%' }}>
              <Condicional condicao={typeof label !== 'undefined'}>
                <Typography
                  variant='body2'
                  textAlign='left'
                  sx={{ mt: theme.inputs.marginTop }}
                >
                  {label}
                </Typography>
              </Condicional>
              <TextField
                {...params}
                size="small"
              />
              <Condicional condicao={typeof erros[field] !== 'undefined'}>
                <Typography variant='caption' textAlign='left' color='warning.main' >{erros[field]}</Typography>
              </Condicional>
            </FormControl>
          }
          renderOption={( props, option, { selected } ) => {
            return (
              <li {...props} key={option[fieldIdSelect]}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option[fieldSelect]}
              </li>
            )
          }}
          disabled={disabled}

          inputValue={valorPesquisa}
          onInputChange={( _event, value, reason ) => {
            if ( reason === 'input' ) {
              setValorPesquisa( value );
            }
          }}
        />

      </div>
    </>
  )

}