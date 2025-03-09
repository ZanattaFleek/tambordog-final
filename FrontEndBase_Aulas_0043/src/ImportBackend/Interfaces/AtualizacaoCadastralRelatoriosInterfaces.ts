import { AtualizacaoCadastroProdutorCulturaInterface } from "./AtualizacaoCadastroInterfaces"

export interface RelatorioAtualizacaoInterface {
  inicio: string
  termino: string
  descricao: string
  cultura: string
}

export interface rsRelatorioAtualizacaoInterface {
  idProdutor: number
  nome: string
  idPropriedade: number
  fazenda: string
  municipio: string
  uf: string
  culturas: Array<AtualizacaoCadastroProdutorCulturaInterface>
  parceirosComerciais: string
  cpfCnpj: string
  observacao: string
  associado: string
  email: string
  fone: string
  codigocliente: string
  cadastradoERP: string
  usuarioCadastro: string
}