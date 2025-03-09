export const EMDESENVOLVIMENTO: boolean = true

export const VERSAO_SISTEMA = '1.30'

export const PORT_ENDPOINT: number = process.env.REACT_APP_PORT_ENDPOINT as unknown as number

export const URL_ENDPOINT: string = EMDESENVOLVIMENTO ? 'localhost' : process.env.REACT_APP_URL_ENDPOINT as unknown as string

export const URL_CLIENT: string = 'http'.concat( EMDESENVOLVIMENTO ? '://' : 's://' ).concat( URL_ENDPOINT ).concat( EMDESENVOLVIMENTO ? ':3000/' : '/' )

export const ENDPOINT_GRAPHQL: string = 'http'.concat( EMDESENVOLVIMENTO ? '://' : 's://' ).concat( URL_ENDPOINT ).concat( ':' ).concat( PORT_ENDPOINT.toString() ).concat( '/graphql' )

export const ENDPOINT: string = 'http'.concat( EMDESENVOLVIMENTO ? '://' : 's://' ).concat( URL_ENDPOINT ).concat( ':' ).concat( PORT_ENDPOINT.toString() ).concat( '/' )

// export const ID_PARAMETRO_PADRAO: number = 1
