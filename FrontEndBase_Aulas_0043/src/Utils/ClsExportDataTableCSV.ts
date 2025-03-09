import { DataTableCabecalhoInterface } from "../DevComponents/DataTable";

const CARACTER_SEPARACAO = ';'

export default class ClsExportDataTableCSV {

  /**
   * Exporta Dados do DataTable para CSV
   */
  public exportCSV (
    nomeArquivo: string,
    registros: Array<any>,
    cabecalho: Array<DataTableCabecalhoInterface>
  ) {

    let conteudo: string = 'data:text/csv;charset=utf-8,\uFEFF'

    cabecalho.forEach( ( coluna, indice ) => {
      if ( indice > 0 ) {
        conteudo = conteudo.concat( CARACTER_SEPARACAO )
      }
      conteudo = conteudo.concat( coluna.cabecalho )
    } )

    conteudo = conteudo.concat( '\r\n' )

    registros.forEach( registro => {

      let linha: string = ''

      cabecalho.forEach( coluna => {
        if ( linha.length > 0 ) {
          linha = linha.concat( CARACTER_SEPARACAO )
        }
        linha = linha.concat(
          coluna.format
            ? coluna.format( registro[coluna.campo], registro )
            : registro[coluna.campo]
        )
      } )

      conteudo = conteudo.concat( linha ).concat( '\r\n' )

    } )

    this.gerarLinkExportar( conteudo, nomeArquivo )

  }

  private gerarLinkExportar (
    conteudo: string,
    nomeArquivo: string
  ) {

    let encodedUri = encodeURI( conteudo )
    let link = document.createElement( "a" )

    link.setAttribute( "href", encodedUri )
    link.setAttribute( "download", nomeArquivo.concat( ".csv" ) )

    document.body.appendChild( link )

    link.click()

  }

}