import { MensagemStateInterface, MensagemTipo } from "../GlobalStates/MensagemState"

export interface BuscaCepInterface {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
}

export default class ClsCep {

  public buscarCep ( setMensagemState: React.Dispatch<React.SetStateAction<MensagemStateInterface>>,
    cep: string ): Promise<BuscaCepInterface | null> {

    const mensagem = {
      cb: null,
      exibirBotao: false,
      tipo: MensagemTipo.Loading,
      titulo: 'Pesquisando Cep...',
      mensagem: 'Buscando Base de Dados...',
      exibir: true
    }

    cep = cep.replace( /[^0-9]/g, "" )

    if ( cep.length === 8 ) {

      setMensagemState( mensagem )

      // console.log( 'https://viacep.com.br/ws/'.concat( cep ).concat( '/json/' ) )

      setMensagemState( { ...mensagem, exibir: false } )

      return fetch( 'https://viacep.com.br/ws/'.concat( cep ).concat( '/json/' ) ).then( rs => {

        return rs.json() as unknown as BuscaCepInterface

      } ).then( rs => {

        if ( rs && rs.cep ) {
          setMensagemState( { ...mensagem, exibir: false } )
          return rs
        } else {
          setMensagemState( { ...mensagem, mensagem: 'Cep Não Localizado!', exibirBotao: true } )
          return null
        }

      } )

    } else {

      return Promise.resolve( null )

    }

  }

  public alterarCep ( novoCep: string,
    setMensagemState: React.Dispatch<React.SetStateAction<MensagemStateInterface>>,
    setDados: React.Dispatch<React.SetStateAction<any>>,
    dados: Record<any, any>,
    incluirSiafi: boolean = true,
    toUpperCase: boolean = false
  ): void {

    if ( novoCep.length === 10 ) {

      this.buscarCep( setMensagemState, novoCep ).then( rs => {
        if ( rs ) {

          let rsDados: Record<any, any> = {
            ...dados,
            cep: novoCep,
            bairro: toUpperCase ? rs.bairro.toUpperCase() : rs.bairro,
            cidade: toUpperCase ? rs.localidade.toUpperCase() : rs.localidade,
            endereco: toUpperCase ? rs.logradouro.toUpperCase() : rs.logradouro,
            uf: rs.uf.toUpperCase()
          }

          if ( incluirSiafi ) {
            rsDados = { ...rsDados, codigoSiafi: rs.siafi }
          }

          setDados( rsDados )

        } else {
          setDados( { ...dados, cep: novoCep } )

        }

      } )

    }

  }

}