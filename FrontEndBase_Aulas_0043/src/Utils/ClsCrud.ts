import { NavigateFunction } from "react-router-dom"
import ClsUtils from "zlib-utils"
import { ContextoGlobalInterface } from "../GlobalStates/ContextoGlobal"
import { MensagemStateInterface, MensagemTipo } from "../GlobalStates/MensagemState"
import { RespostaPadraoInterface } from "../ImportBackend/Interfaces/PadraoInterfaces"
import BackEndAPI from "../Services/BackEndAPI"

export enum StatusForm {
  Incluindo,
  Excluindo,
  Pesquisando,
  Editando,
  Exibindo
}

interface GraphCrudInterface {
  pesquisaQuery: string
  confirmarMutation: string
  excluirMutation: string
  campoId: string
  camposPesquisa: string
  camposPesquisaPorId: string
  pesquisaPorId: string
}

interface MensagensCrudInterface {
  confirmando: string
  pesquisando: string

  tituloConfirmado: string
  sucessoCadastro: string
  atualizacaoSucesso: string
  tituloErroCadastro: string
  erroCadastro: string

  excluindo: string
  tituloConfirmacaoExclusao: string
  sucessoExclusao: string
  tituloErroExclusao: string
  erroExclusao: string

  tituloErroPesquisa: string
  erroPesquisa: string
}

export default class ClsCrud<DadosInterface> {

  private clsUtils: ClsUtils = new ClsUtils()
  private clsApi: BackEndAPI = new BackEndAPI()

  public constructor(
    private navigate: NavigateFunction,
    private ResetDados: DadosInterface,
    private setStatusForm: React.Dispatch<React.SetStateAction<StatusForm>>,
    private setDados: React.Dispatch<React.SetStateAction<DadosInterface>>,
    private setErros: React.Dispatch<React.SetStateAction<{}>>,
    private mensagemState: MensagemStateInterface,
    private setMensagemState: React.Dispatch<React.SetStateAction<MensagemStateInterface>>,
    private setRsPesquisa: React.Dispatch<React.SetStateAction<DadosInterface[]>>,
    private contexto: ContextoGlobalInterface,
    private validarDados: () => boolean,
    private GraphCrud: GraphCrudInterface,
    private MensagensCrud: MensagensCrudInterface
  ) {

  }

  public get StatusForm (): typeof StatusForm {
    return StatusForm
  }

  public btFechar () {
    this.navigate( '/' )
  }

  public btIncluir () {
    this.setDados( this.ResetDados )
    this.setErros( {} )
    this.setStatusForm( StatusForm.Incluindo )
  }

  public btEditar = ( rs: DadosInterface ) => {
    this.pesquisarPorId( ( ( rs as any )[this.GraphCrud.campoId] as number ), this.mensagemState ).then( rs => {
      if ( rs ) {
        this.setDados( rs )
        this.setStatusForm( StatusForm.Editando )
      }
    } )
  }

  public btExcluir = ( rs: DadosInterface ) => {
    this.pesquisarPorId( ( ( rs as any )[this.GraphCrud.campoId] as number ), this.mensagemState ).then( rs => {
      if ( rs ) {
        this.setDados( rs )
        this.setStatusForm( StatusForm.Excluindo )
      }
    } )
  }

  public btCancelar () {
    this.setDados( this.ResetDados )
    this.setErros( {} )
    this.setStatusForm( StatusForm.Pesquisando )
  }

  public btConfirmar ( dados: DadosInterface, mensagemState: MensagemStateInterface, statusForm: StatusForm, pesquisa: string | Record<string, number | string | any> ) {
    if ( this.validarDados() ) {
      const mutation: string = `
        ${this.GraphCrud.confirmarMutation}(dados: ${this.clsUtils.ConverterEmGql( dados as Object )}) {
          ok
          mensagem
        }
      `

      this.clsApi.mutation<RespostaPadraoInterface>( mutation, this.GraphCrud.confirmarMutation, this.MensagensCrud.confirmando, this.contexto ).then( rs => {

        if ( rs.ok ) {
          this.setMensagemState( {
            ...mensagemState,
            titulo: this.MensagensCrud.tituloConfirmado,
            exibir: true,
            mensagem: statusForm === StatusForm.Incluindo ? this.MensagensCrud.sucessoCadastro : this.MensagensCrud.atualizacaoSucesso,
            tipo: MensagemTipo.Info,
            exibirBotao: true
          } )

          this.setDados( this.ResetDados )
          this.setStatusForm( StatusForm.Pesquisando )

          this.onClickPesquisa( pesquisa, mensagemState )

        } else {

          this.setMensagemState( {
            ...mensagemState,
            exibir: true,
            titulo: this.MensagensCrud.tituloErroCadastro,
            mensagem: rs.mensagem,
            tipo: MensagemTipo.Error,
            exibirBotao: true
          } )

        }

      } ).catch( () => {

        this.setMensagemState( {
          ...mensagemState,
          exibir: true,
          titulo: this.MensagensCrud.tituloErroCadastro,
          mensagem: this.MensagensCrud.erroCadastro,
          tipo: MensagemTipo.Error,
          exibirBotao: true
        } )

      } )

    }
  }

  public btConfirmarExclusao ( dados: DadosInterface, mensagemState: MensagemStateInterface, pesquisa: string | Record<string, number | string | any> ) {
    const mutation: string = `
        ${this.GraphCrud.excluirMutation}(${this.GraphCrud.campoId}: ${( dados as any )[this.GraphCrud.campoId]}) {
          ok
          mensagem
        }
      `

    this.clsApi.mutation<RespostaPadraoInterface>( mutation, this.GraphCrud.excluirMutation, this.MensagensCrud.excluindo, this.contexto ).then( rs => {

      if ( rs.ok ) {
        this.setMensagemState( {
          ...mensagemState,
          titulo: this.MensagensCrud.tituloConfirmacaoExclusao,
          exibir: true,
          mensagem: this.MensagensCrud.sucessoExclusao,
          tipo: MensagemTipo.Info,
          exibirBotao: true
        } )

        this.setDados( this.ResetDados )

        this.setStatusForm( StatusForm.Pesquisando )

        this.onClickPesquisa( pesquisa, mensagemState )

      } else {

        this.setMensagemState( {
          ...mensagemState,
          titulo: this.MensagensCrud.tituloErroExclusao,
          exibir: true,
          mensagem: rs.mensagem,
          tipo: MensagemTipo.Error,
          exibirBotao: true
        } )

      }

    } ).catch( () => {

      this.setMensagemState( {
        ...mensagemState,
        titulo: this.MensagensCrud.tituloErroExclusao,
        exibir: true,
        mensagem: this.MensagensCrud.erroExclusao,
        tipo: MensagemTipo.Error,
        exibirBotao: true
      } )

    } )
  }

  public onClickPesquisa = (
    pesquisa: string | Record<string, number | string | any>,
    mensagemState: MensagemStateInterface
  ) => {

    const clsUtils = new ClsUtils()

    const query =
      typeof pesquisa === 'string' ?
        `
      ${this.GraphCrud.pesquisaQuery}(pesquisa: "${pesquisa}") ${this.GraphCrud.camposPesquisa}
    `
        :
        `
      ${this.GraphCrud.pesquisaQuery}(pesquisa: ${clsUtils.ConverterEmGql( pesquisa )}) ${this.GraphCrud.camposPesquisa}
    `

    this.clsApi.query<Array<DadosInterface>>( query, this.GraphCrud.pesquisaQuery, this.MensagensCrud.pesquisando, this.contexto ).then( rs => {

      this.setRsPesquisa( rs )

    } ).catch( () => {

      this.setMensagemState( {
        ...mensagemState,
        titulo: this.MensagensCrud.tituloErroPesquisa,
        exibir: true,
        mensagem: this.MensagensCrud.erroPesquisa,
        tipo: MensagemTipo.Error,
        exibirBotao: true
      } )

    } )

  }

  public pesquisarPorId (
    id: number,
    mensagemState: MensagemStateInterface
  ): Promise<DadosInterface | null> {

    const query = `
        ${this.GraphCrud.pesquisaPorId}(${this.GraphCrud.campoId}: ${id}) ${this.GraphCrud.camposPesquisaPorId}
      `

    return this.clsApi.query<DadosInterface>( query, this.GraphCrud.pesquisaPorId, this.MensagensCrud.pesquisando, this.contexto ).then( rs => {

      this.setDados( rs )

      return rs

    } ).catch( () => {

      this.setMensagemState( {
        ...mensagemState,
        titulo: this.MensagensCrud.tituloErroPesquisa,
        exibir: true,
        mensagem: this.MensagensCrud.erroPesquisa,
        tipo: MensagemTipo.Error,
        exibirBotao: true
      } )

      return null

    } )

  }

}