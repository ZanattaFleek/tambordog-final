import React, { useState, useContext, useEffect, useRef } from 'react'
import TextField from '@mui/material/TextField/TextField'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import { useTheme, IconButton, Grid, Autocomplete } from '@mui/material'
import BackEndAPI from '../Services/BackEndAPI'
import { ContextoGlobal, ContextoGlobalInterface } from '../GlobalStates/ContextoGlobal'
import Condicional from '../Layout/Condicional'
import { MensagemTipo } from '../GlobalStates/MensagemState'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import styled from '@emotion/styled'

const GroupHeader = styled( 'div' )( ( { theme } ) => ( {
  position: 'sticky',
  // top: '8px',
  paddingLeft: '4px',
  paddingTop: '8px',
  fontWeight: 'bold'
  /*
  color: theme.palette.primary.main,
  backgroundColor:
    theme.palette.mode === 'light'
      ? lighten( theme.palette.primary.light, 0.85 )
      : darken( theme.palette.primary.main, 0.8 ),
      */
} ) );

const GroupItems = styled( 'ul' )( {
  padding: 0,
  margin: 0
} );

export interface pesquisarTabelaPropsInterface<T> {
  /* State para setup dos dados */
  setState?: React.Dispatch<React.SetStateAction<any>>
  /* Campo dentro do State a ser Setado */
  field: string
  /* Campo retornado da Pesquisa para ser usado como ID */
  fieldSet: string
  /* Label do Campo (Acima do texto) */
  label: string
  /* Dados Originais */
  dados: { [key: string]: string | number | readonly string[] | undefined | any }
  /* Campo 'Pesquisa' que normalmente as querys de pesquisa possuem - pesquisa geral */
  campoQueryPesquisa: string
  /* Nome da Query Pesquisa */
  nomeQueryPesquisa: string
  /* JSON de fields que serão retornados da pesquisa */
  camposRetornoQueryPesquisa: string
  /* Label da Query de Pesquisa que será apresentado ao usuário */
  campoLabelQueryPesquisa: string
  /* Campos para Exibir Nos Registros Encontrados */
  camposParaExibir?: Array<string>
  /* Pesquisa pelo ID - Quando há ID para ser procurado e ser exibido inicialmente */
  campoQueryPesquisaID: string
  /* Query para Pesquisa inicial do ID inicial do campo */
  nomeQueryPesquisaID: string
  /* Mensagem enquanto ocorre o Loading da Pesquisa */
  mensagemPesquisa: string
  /* Objeto Erros */
  erros?: { [key: string]: string }
  disabled?: boolean
  onChange?: ( v: T ) => void
  /* Se realiza uma pesquisa com argumento 'vazio' e retorna todas as pesquisas possível */
  pesquisarTudoAoIniciar?: boolean
  /* Valor a Ser atribuido quando usuário "clica" no "x" */
  valorAtribuirLimpar?: number | string | boolean
  /* Se deve converter o input para UpperCase */
  inputUpperCase?: boolean
  /* Função Utilizada para Agrupamento */
  groupBy?: ( v: T ) => string
}

export default function PesquisarTabela<T> ( {
  setState = undefined,
  field,
  fieldSet,
  label,
  dados,
  campoQueryPesquisa,
  nomeQueryPesquisa,
  campoQueryPesquisaID,
  camposRetornoQueryPesquisa,
  campoLabelQueryPesquisa,
  nomeQueryPesquisaID,
  mensagemPesquisa,
  erros = {},
  disabled = false,
  onChange = undefined,
  pesquisarTudoAoIniciar = false,
  valorAtribuirLimpar = undefined,
  inputUpperCase = false,
  groupBy = undefined,
  camposParaExibir = []
}: pesquisarTabelaPropsInterface<T> ) {

  const [open, setOpen] = React.useState( false );

  const contexto: ContextoGlobalInterface = ( useContext( ContextoGlobal ) as ContextoGlobalInterface )

  const theme = useTheme()
  const clsApi = new BackEndAPI()

  const [pesquisa, setPesquisa] = useState( '' )

  const [rsPesquisa, setRsPesquisa] = useState( [] as Array<any> )

  const refUltimaPesquisa = useRef<{ pesquisa: string | null, retorno: Array<any> }>( { pesquisa: null, retorno: [] } )

  const onClickSearch = ( abrirSelecao: boolean ) => {

    if ( refUltimaPesquisa.current.pesquisa !== pesquisa ) {

      const query: string = `
      ${nomeQueryPesquisa}(${campoQueryPesquisa}: "${pesquisa}") ${camposRetornoQueryPesquisa}
      `

      clsApi.query<Array<any>>( query, nomeQueryPesquisa, mensagemPesquisa, contexto ).then( rs => {
        refUltimaPesquisa.current = {
          pesquisa: pesquisa,
          retorno: rs
        }
        setRsPesquisa( rs )
        setOpen( abrirSelecao )
      } )

    } else {
      setRsPesquisa( refUltimaPesquisa.current.retorno )
    }

    // setIsOpen( true )

  }

  const pesquisaValorInicialCampoPorId = () => {

    // Pesquisa caso haja um campo....
    if ( ( typeof dados[field] === 'number' && dados[field] > 0 )
      || ( typeof dados[field] === 'string' && dados[field].length > 0 )
    ) {

      let indiceRegistro: number = -1

      if ( rsPesquisa.length > 0 ) {
        indiceRegistro = rsPesquisa.findIndex( v => v[campoQueryPesquisaID as any] === dados[field] )
      }

      /*
      console.log( 'indiceRegistro', indiceRegistro )
      console.log( 'rsPesquisa', rsPesquisa )
      console.log( 'dados[field]', dados[field] )
      */

      if ( indiceRegistro < 0 ) {

        let query: string = ''


        if ( typeof dados[field] === 'string' ) {
          query = `${nomeQueryPesquisaID}(${campoQueryPesquisaID}: "${dados[field]}") ${camposRetornoQueryPesquisa}`
        } else {
          query = `${nomeQueryPesquisaID}(${campoQueryPesquisaID}: ${dados[field]}) ${camposRetornoQueryPesquisa}`
        }

        clsApi.query<T>( query, nomeQueryPesquisaID, mensagemPesquisa, contexto, abortController ).then( rs => {

          // console.log( 'rsPesquisa', rs )
          setRsPesquisa( [rs] )

        } ).catch( ( e ) => {

          contexto.setMensagemState( {
            ...contexto.mensagemState,
            titulo: 'Erro! Consulte Suporte!',
            exibir: true,
            mensagem: 'Erro ao Consultar Search Text!',
            tipo: MensagemTipo.Error,
            exibirBotao: true
          } )

        } )

        return () => {

          abortController.abort()

        }

      }

    }
  }

  // Pesquisa Quando o campo já vem preenchido...

  const abortController: AbortController = new AbortController()

  const idPesquisado = useRef( -1 )

  useEffect( () => {

    if ( pesquisarTudoAoIniciar && idPesquisado.current !== dados[fieldSet] ) {

      onClickSearch( false )

    } else {
      if ( idPesquisado.current !== dados[fieldSet] ) {
        idPesquisado.current = dados[fieldSet]
        pesquisaValorInicialCampoPorId()
      }

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dados[fieldSet]] )
  // }, [keyRefresh] )

  const exibirCamposAdicionais = ( dados: any ) => {
    if ( camposParaExibir.length === 0 ) {
      return dados[campoLabelQueryPesquisa]
    } else {

      let retorno: string = ""

      camposParaExibir.forEach( op => {
        if ( retorno.length > 0 ) {
          retorno = retorno.concat( ' | ' )
        }
        retorno = retorno.concat( dados[op] )
      } )

      return retorno

    }
  }

  /*
  Auto COmplete...

filterOptions={( x ) => x}
disablePortal
handleHomeEndKeys

  */

  // const [isOpen, setIsOpen] = useState( false )

  return (
    <>
      <Autocomplete
        renderGroup={( params ) => (
          <li key={params.key}>
            <GroupHeader>{params.group}</GroupHeader>
            <GroupItems>{params.children}</GroupItems>
          </li>
        )}
        groupBy={groupBy ? groupBy : undefined}
        // openOnFocus={true}
        open={open}
        onOpen={() => {
          setOpen( true );
        }}
        onClose={() => {
          setOpen( false );
        }}
        value={dados[fieldSet]}
        disabled={disabled}
        id="idPesquisarTabelaComponente"
        getOptionLabel={( opcao: any ) => {
          if ( opcao && opcao[campoLabelQueryPesquisa] ) {
            return opcao[campoLabelQueryPesquisa]
          } else {

            const retorno = rsPesquisa.find( ( v ) => v[campoQueryPesquisaID] === opcao )

            if ( retorno && retorno[campoLabelQueryPesquisa] ) {
              return retorno[campoLabelQueryPesquisa]
            } else {
              return ''
            }

          }
        }
        }
        onChange={( _e, v ) => {

          if ( onChange ) {

            //@ts-ignore
            onChange( v )

          } else if ( setState ) {

            //@ts-ignore
            setState( { ...dados, [fieldSet]: v !== null ? v[field] : typeof valorAtribuirLimpar !== 'undefined' ? valorAtribuirLimpar : v } )

          }

        }}
        isOptionEqualToValue={
          ( _opcao, _valor ) => {
            return true
          }
        }
        options={rsPesquisa}
        inputValue={pesquisa}
        onInputChange={( _event: React.SyntheticEvent, value: string, reason: string ) => {
          if ( value ) { setPesquisa( inputUpperCase ? value.toUpperCase() : value ) } else { setPesquisa( '' ) }
        }}
        renderOption={( props, option: any ) => {
          return (
            <li {...props} key={option[field]}>
              <Grid container sx={{ display: 'flex', alignItems: 'stretch' }}>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography
                    variant='body2'
                    textAlign='left'
                    sx={{ mt: theme.inputs.marginTop }}
                  >
                    <Condicional condicao={camposParaExibir.length === 0}>
                      {option[campoLabelQueryPesquisa]}
                    </Condicional>
                    <Condicional condicao={camposParaExibir.length > 0}>
                      {exibirCamposAdicionais( option )}
                    </Condicional>
                  </Typography>
                </Grid>
              </Grid>
            </li>
          );
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
                    <IconButton onClick={() => onClickSearch( true )}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}

              size="small" onKeyDown={
                ( ev ) => {

                  if ( ev.key === 'Enter' ) {
                    onClickSearch( true )
                  }

                  return null

                }
              } />
            <Condicional condicao={typeof erros[fieldSet] !== 'undefined'}>
              <Typography variant='caption' textAlign='left' color='warning.main' >{erros[fieldSet]}</Typography>
            </Condicional>
          </FormControl>
        }

        onKeyDown={( event ) => {
          if ( event.key === 'Enter' ) {
            event.preventDefault()
          }
        }}

      />
    </>
  )

}