
export interface AtualizacaoCadastroProdutorInterface {
  idProdutor?: number
  tipo: string
  nome: string
  cpfCnpj: string
  associado: boolean
  codigocliente: string
  email: string
  fone: string
  parceirosComerciais: string
  observacao: string
  idUsuario: number
  cadastradoERP: boolean
}

export interface AtualizacaoCadastroProdutorCulturaInterface {
  safra: string
  cultura: string
  area: number
  materialPlantado: string
}

export interface AtualizacaoCadastroProdutorPropriedadeInterface {
  idPropriedade?: number
  idProdutor: number
  fazenda: string
  municipio: string
  uf: string
  areaFazenda: number
  areaIrrigada: number
  areaSequeiro: number
  culturas: Array<AtualizacaoCadastroProdutorCulturaInterface>
  leiteMes: number
  animaisCorteAno: number
}

export interface rsPesquisaProdutorRespostaInterface {
  cadastradoERP: boolean
  cadastradoAPP: boolean
  nome: string
  cpfCnpj: string
  codigocliente: string
  associado: boolean
}
