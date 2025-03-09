export interface PedidoInterface {
  idPedido?: number
  idPedidoERP: number
  idRepresentante: number
  idUnidadeFaturamento: number
  idPessoaAutorizadaComprar: number
  idNaturezaOperacao: number
  idCliente: number
  idCondicaoPagamento: number
  idMeioPagamento: number
  observacao: string
  vrBruto: number
  perDesconto: number
  vrDesconto: number
  perAcrescimo: number
  vrAcrescimo: number
  vrLiquido: number
  idEmpresa: number
  pedidoItens: Array<PedidoItemInterface>
  pagamentos: Array<PedidoPagamentoInterface>
  codigoClienteERP: number
  nomeFantasiaERP: string
  nomeClienteERP: string
  logradouroERP: string
  cidadeERP: string
  destacarDesconto: boolean
}

export interface PedidoItemInterface {
  idPedidoItem?: number
  idPedido: number
  idEmpresa: number
  idCentroEstoque: number
  descricaoCentroEstoque: string
  descricaoProduto: string
  idProduto: number
  tipoDescontoAcrescimoUnitario: boolean
  perDescontoUnitario: number
  vrDescontoUnitario: number
  perAcrescimoUnitario: number
  vrAcrescimoUnitario: number
  perDesconto: number
  vrDesconto: number
  perAcrescimo: number
  vrAcrescimo: number
  vrUnitario: number
  vrTotal: number
  vrLiquido: number
  saldoEstoque: number
  permitirEstoqueNegativo: boolean
  perComissao: number
  quantidade: number
  desconto: number
  vrSugerido: number
  vrMinimo: number
  vrMaximo: number
  idUnidadeMedida: number
}

export interface PedidoPagamentoPersonalizadoInterface {
  data: string
  valor: number
}

export interface PedidoPagamentoInterface {
  tipoPagamentoNFeIdentificador: number
  idPedidoPagamento?: number
  idPedido?: number
  idCondicaoPagamento: number
  idMeioPagamento: number
  idEmpresa: number
  descricaoCentroEstoque: string
  valor: number
  dataValorPersonalizado: boolean
  datasEValores: Array<PedidoPagamentoPersonalizadoInterface>
  numeroParcelas: number
}

export interface PedidoPesquisaInterface {
  descricao: string
  inicio: string
  termino: string
  idRepresentante: Array<number>
  status: Array<number>
  empresa: Array<number>
}

export interface rsERPCondicaoPagamentoInterface {
  ID_TIPO_PAGAMENTO: number
  ID_CONDICAO_PAGAMENTO: number
  DESCRICAO: string
  ID_MEIO_PAGAMENTO: number
  NUMEROPARCELAS: number
}

export interface rsERPDescontoMaximoRepresentanteInterface {
  PERC_DESCONTO_PEDIDO: number
  ID_REPRESENTANTE: number
}

export interface rsERPEstoqueProdutoInterface {
  ID_PRODUTO: number
  ID_EMPRESA: number
  ID_CENTRO_ESTOQUE: number
  PERMITIR_ESTOQUE_NEGATIVO: boolean
  DESCRICAO: string
  SALDO_QTD: number
  VALOR_UNITARIO: number
  VALOR_SUGERIDO: number
  PERC_COMISSAO: number
  VALOR_MINIMO: number
  VALOR_MAXIMO: number
  VALOR_CUSTO: number
}

export interface rsERPLimiteCreditoInterface {
  ID_CLIENTE: number
  HABIL_PARA_COMPRA: boolean
  NAO_AVALIAR_FINANCEIRO: boolean
  LIMITE_CREDITO: number
  DIAS_CARENCIA_SALDO_VENC: number
  VR_TIT_VENC_FOR_CAR: number
  VR_TITULOS_EM_ABERTO: number
  CONDICOES_PAGAMENTO: Array<rsERPCondicaoPagamentoInterface>
}

export interface rsERPTotalTitulosEmAbertoInterface {
  TOTAL: number
}

export interface rsERPTitulosEmAbertoAteDataInterface {
  TOTAL: number
}

export interface rsERPUnidadeFaturamentoInterface {
  ID_UNIDADE_FAT_CLIENTE: number
  ID_PESSOA: number
  ID_CLIENTE: number
  CODIGO_CLIENTE: number
  NOME: string
  NOME_FANTASIA: string
  LOGRADOURO: string
  NUMERO: string
  BAIRRO: string
  CIDADE: string
  CNPJ: string
  INSCRICAO_ESTADUAL: string
  ATIVO: boolean
}

export interface rsERPPessoaAutorizadaAComprarInterface {
  ID_PESSOA: number
  NOME: string
}

export interface rsERPNaturezaOperacaoInterface {
  ID_NATUREZA_OPERACAO: number
  DESCRICAO: string
}

export interface rsERPProdutoInterface {
  ID_PRODUTO: number
  CODIGO_AUXILIAR: string
  NOME: string
  ATIVO: number
  ID_UNIDADE_MEDIDA: number
}

export interface rsERPTransportadorInterface {
  ID_TRANSPORTADOR: number
  NOME: string
}

export interface rsIncluirPedidoInterface {
  idEmpresa: number
  idPedido: number
  mensagem: string
}

export interface rsConsultaGenericaInterface {
  id: number
  descricao: string
}
