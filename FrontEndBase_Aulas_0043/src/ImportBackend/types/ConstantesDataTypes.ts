export const SITUACAO_PEDIDO_APP = 10

// Tipo de Cliente


export interface TipoClienteInterface {
  idTipoCliente: string
  descricao: string
}

export enum TipoClienteType {
  PF = 'PF',
  PJ = 'PJ'
}

export const TipoClienteTypes: Array<TipoClienteInterface> = [
  { idTipoCliente: TipoClienteType.PF, descricao: 'Física' },
  { idTipoCliente: TipoClienteType.PJ, descricao: 'Jurídica' }
]
