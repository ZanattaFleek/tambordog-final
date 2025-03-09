import { DocumentNode, gql } from "@apollo/client"
import ClsUtils from "zlib-utils"
import { LOGARBACKENDAPI, LOGARBACKENDAPIRESULTADO } from "../Config/ConfigFrontEnd"
import { ContextoGlobalInterface } from "../GlobalStates/ContextoGlobal"
import { MensagemStateInterface, MensagemTipo } from "../GlobalStates/MensagemState"
import { EMDESENVOLVIMENTO, ENDPOINT, ENDPOINT_GRAPHQL } from "../ImportBackend/Config/emDesenvolvimento"

export default class BackEndAPI {

  public query<T> (
    query: string,
    objRetorno: string,
    mensagem: string,
    contextoGlobal: ContextoGlobalInterface,
    abortController: AbortController = new AbortController(),
    exibirMensagem: boolean = true
  ): Promise<T> {

    const MensagemQuery: MensagemStateInterface = {
      titulo: 'Processando...',
      mensagem: mensagem,
      exibir: exibirMensagem,
      tipo: MensagemTipo.Loading,
      exibirBotao: false,
      cb: null
    }

    contextoGlobal.setMensagemState( MensagemQuery )

    if ( LOGARBACKENDAPI && EMDESENVOLVIMENTO ) console.log( 'Query: ', query )

    return new Promise( ( resolve, reject ) => {

      try {

        contextoGlobal.apolloClient
          .query( {
            errorPolicy: 'all',
            query: gql( `query { ${query} }` ),
            context: {
              signal: abortController.signal
            }
          } ).then( ( result ) => {

            if ( result.data ) {

              contextoGlobal.setMensagemState( { ...MensagemQuery, exibir: false } )

              if ( objRetorno ) {
                if ( LOGARBACKENDAPIRESULTADO && EMDESENVOLVIMENTO ) console.log( 'Result Query '.concat( objRetorno ).concat( ":" ), result.data[objRetorno] )
                resolve( result.data[objRetorno] as T )
              } else {
                if ( LOGARBACKENDAPIRESULTADO && EMDESENVOLVIMENTO ) console.log( 'Result Query: ', result )
                resolve( result as T )
              }

            } else if ( result.errors && result.errors.length > 0 ) {

              throw ( result.errors[0] )

            }

          } ).catch( err => {

            console.log( 'Erro Processamento - Envie Mensagem ao Suporte - 01: ', err )

            contextoGlobal.setMensagemState( {
              ...MensagemQuery,
              titulo: 'Sistema Indisponível. Se possível, enviar ao Suporte: Query',
              exibir: true,
              tipo: MensagemTipo.Error,
              mensagem: err.message || err || ''
            } )

            // reject( err )

          } )

      } catch ( err: any ) {

        console.log( 'Erro Processamento - Envie Mensagem ao Suporte - 02: ', err )

        contextoGlobal.setMensagemState( {
          ...MensagemQuery,
          titulo: 'Erro no Servidor - Query',
          exibir: true,
          tipo: MensagemTipo.Error,
          mensagem: err.message
        } )

        reject( 'Erro no Servidor' )

      }

    } )

  }

  public mutation<T> (
    mutation: string,
    objRetorno: string,
    mensagem: string,
    contextoGlobal: ContextoGlobalInterface,
    abortController: AbortController = new AbortController()
  ): Promise<T> {

    const MensagemMutation = {
      titulo: 'Processando...',
      mensagem: mensagem,
      exibir: true,
      tipo: MensagemTipo.Loading,
      exibirBotao: false,
      cb: null
    }

    contextoGlobal.setMensagemState( MensagemMutation )

    if ( LOGARBACKENDAPI && EMDESENVOLVIMENTO ) console.log( 'Mutation: ', mutation )

    return new Promise( ( resolve, reject ) => {

      try {

        contextoGlobal.apolloClient
          .mutate( {
            mutation: gql( `mutation { ${mutation} }` ),
            context: {
              signal: abortController.signal
            }
          } )

          .then( ( result ) => {
            contextoGlobal.setMensagemState( { ...MensagemMutation, exibir: false } )
            if ( objRetorno ) {
              if ( LOGARBACKENDAPIRESULTADO && EMDESENVOLVIMENTO ) console.log( 'Result Mutation '.concat( objRetorno ).concat( ":" ), result.data[objRetorno] )
              resolve( result.data[objRetorno] as T )
            } else {
              if ( LOGARBACKENDAPIRESULTADO && EMDESENVOLVIMENTO ) console.log( 'Result Mutation: ', result )
              resolve( result as T )
            }
          } )

          .catch( err => {

            console.log( 'Erro Processamento - Envie Mensagem ao Suporte - 03: ', err )

            contextoGlobal.setMensagemState( {
              ...MensagemMutation,
              titulo: 'Erro de Processamento - Mutation',
              exibirBotao: true,
              exibir: true,
              tipo: MensagemTipo.Error,
              mensagem: err.message
            } )

            // reject( 'Erro no Processamento' )

          } )

      } catch ( err: any ) {

        console.log( 'Erro Processamento - Envie Mensagem ao Suporte - 04: ', err )

        contextoGlobal.setMensagemState( {
          ...MensagemMutation,
          titulo: 'Erro no Servidor - Mutation',
          exibir: true,
          tipo: MensagemTipo.Error,
          mensagem: err.message
        } )

        reject( 'Erro no Servidor' )

      }

    } )

  }

  public post<T> (
    url: string,
    body: { [key: string]: number | string | DocumentNode },
    mensagem: string,
    mensagemState: MensagemStateInterface,
    setMensagemState: React.Dispatch<React.SetStateAction<MensagemStateInterface>>
  ): Promise<T> {

    let headers = new Headers()

    headers.set( 'Content-Type', 'application/json' )
    headers.set( 'Accept', 'application/json' )
    // headers.set('Access-Control-Allow-Origin', "*")

    const parametros: RequestInit = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify( body )
    }

    setMensagemState( { ...mensagemState, mensagem: mensagem } )

    return fetch( ENDPOINT_GRAPHQL.concat( url ), parametros ).then( rs => {
      return rs.json() as Promise<T>
    } )

  }

  public get<T> (
    rest: string,
    mensagem: string,
    dados: { [key: string]: number | string } | null,
    objRetorno: string | null,
    contextoGlobal: ContextoGlobalInterface,
  ): Promise<T> {

    let urlparameters: string = ''

    if ( dados ) {
      urlparameters = ( new ClsUtils() ).jsonToSearchParameters( dados )
    }

    let headers = new Headers()

    headers.set( 'Content-Type', 'application/json' )
    headers.set( 'Accept', 'application/json' )
    // headers.set('Access-Control-Allow-Origin', "*")

    const parametros: RequestInit = {
      method: 'GET',
      headers: headers
    }

    contextoGlobal.setMensagemState( {
      titulo: 'Processando...',
      mensagem: mensagem,
      exibir: true,
      tipo: MensagemTipo.Info,
      exibirBotao: false,
      cb: null
    } )

    return fetch( ENDPOINT.concat( rest ).concat( urlparameters ), parametros ).then( rs => {

      return rs.json()

    } ).then( rs => {

      if ( objRetorno && rs[objRetorno] ) {
        return rs[objRetorno]
      } else {
        return rs
      }

    } )

  }

}
