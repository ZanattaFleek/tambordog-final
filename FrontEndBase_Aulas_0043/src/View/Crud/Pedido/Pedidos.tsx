import React, { useContext, useEffect, useState } from 'react'
import { Box, Container, Grid, Icon, IconButton, Typography } from '@mui/material'
import InputText from '../../../DevComponents/InputText'
import { ContextoGlobal, ContextoGlobalInterface } from '../../../GlobalStates/ContextoGlobal'
import Condicional from '../../../Layout/Condicional'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search';

import DataTable, { DataTableCabecalhoInterface } from '../../../DevComponents/DataTable'
import { useNavigate } from 'react-router-dom'
import ClsCrud, { StatusForm } from '../../../Utils/ClsCrud'

import ClsValidacao from '../../../Utils/ClsValidacao'
import BackEndAPI from '../../../Services/BackEndAPI'
import ExibirJSONDev from '../../../DevComponents/ExibirJSONDev'
import PesquisarTabela from '../../../DevComponents/PesquisarTabela'
import { PedidoInterface, rsERPPessoaAutorizadaAComprarInterface, rsERPUnidadeFaturamentoInterface, rsERPNaturezaOperacaoInterface, PedidoItemInterface, rsERPLimiteCreditoInterface, rsIncluirPedidoInterface, PedidoPagamentoInterface, PedidoPesquisaInterface } from '../../../ImportBackend/Interfaces/PedidoInterfaces'
import ShowText from '../../../DevComponents/ShowText'
import ComboBox from '../../../DevComponents/ComboBox'
import { EMDESENVOLVIMENTO } from '../../../ImportBackend/Config/emDesenvolvimento'
import PedidosItem from './PedidosItem'
import { clsUtils } from 'zlib-utils'
import { MensagemTipo } from '../../../GlobalStates/MensagemState'
import ClsFormatacao from '../../../Utils/ClsFormatacao'
import { DateTime } from 'luxon'
import PedidoShow from './PedidoShow'
import PedidosPagamentos from './PedidosPagamentos'
import SelectMultiplo from '../../../DevComponents/SelectMultiplo'
import { SISTEMA_PERMISSOES } from '../../../ImportBackend/types/AcessosDataTypes'
import ClsAcesso from '../../../Utils/ClsAcesso'

const CONDICAO_PAGAMENTO_PADRAO: number = 1
const MEIO_PAGAMENTO_PADRAO: number = 3
const NATUREZA_OPERACAO: number = 34

export interface ProdutorParaEditarPropriedadeInterface {
  idProdutor: number
  nome: string
}

interface PesquisaInterface {
  descricao: string
  inicio: string
  termino: string
  idRepresentante: Array<{ idRepresentante: number, nomeERP: string }>
  status: Array<{ id: number, descricao: string }>
  empresa: Array<{ id: number, descricao: string }>
}

export default function Pedidos () {

  const ResetERPUnidadeFaturamento: rsERPUnidadeFaturamentoInterface = {
    ID_UNIDADE_FAT_CLIENTE: 0,
    ID_CLIENTE: 0,
    CODIGO_CLIENTE: 0,
    ID_PESSOA: 0,
    NOME_FANTASIA: '',
    NOME: '',
    LOGRADOURO: '',
    NUMERO: '',
    BAIRRO: '',
    CIDADE: '',
    CNPJ: '',
    INSCRICAO_ESTADUAL: '',
    ATIVO: true
  }

  const ResetERPLimiteCredito: rsERPLimiteCreditoInterface = {
    ID_CLIENTE: 0,
    HABIL_PARA_COMPRA: false,
    NAO_AVALIAR_FINANCEIRO: false,
    LIMITE_CREDITO: 0,
    DIAS_CARENCIA_SALDO_VENC: 0,
    VR_TIT_VENC_FOR_CAR: 0,
    VR_TITULOS_EM_ABERTO: 0,
    CONDICOES_PAGAMENTO: []
  }

  const clsAcesso: ClsAcesso = new ClsAcesso()

  const [rsERPUnidadeFaturamento, setRsERPUnidadeFaturamento] = useState<rsERPUnidadeFaturamentoInterface>( ResetERPUnidadeFaturamento )

  const abortController: AbortController = new AbortController()

  const [statusForm, setStatusForm] = useState<StatusForm>( StatusForm.Pesquisando )

  const [rsPessoasAutorizadasComprar, setRsPessoasAutorizadasComprar] = useState<Array<rsERPPessoaAutorizadaAComprarInterface>>( [] )
  const [rsLimiteCredito, setRsLimiteCredito] = useState<rsERPLimiteCreditoInterface>( ResetERPLimiteCredito )

  const [rsPedidoItens, setRsPedidoItens] = useState<Array<PedidoItemInterface>>( [] )

  const [rsExibirDados, setRsExibirDados] = useState<boolean>( true )

  const clsFormato: ClsFormatacao = new ClsFormatacao()
  const Cabecalho: Array<DataTableCabecalhoInterface> = [
    {
      campo: 'idPedidoERP',
      cabecalho: 'ERP',
      alinhamento: 'left'
    },
    {
      campo: 'createdAt',
      cabecalho: 'Data',
      alinhamento: 'left',
      format: ( rs ) => DateTime.fromISO( rs ).toFormat( 'dd/MM/yyyy' )
    },
    {
      campo: 'situacaoPedidoERP',
      cabecalho: 'Status',
      alinhamento: 'left'
    },
    {
      campo: 'empresaERP',
      cabecalho: 'Empresa',
      alinhamento: 'left'
    },
    {
      campo: 'codigoClienteERP',
      cabecalho: 'Matrícula',
      alinhamento: 'left'
    },
    {
      campo: 'nomeFantasiaERP',
      cabecalho: 'Nome Fantasia',
      alinhamento: 'left'
    },
    {
      campo: 'nomeClienteERP',
      cabecalho: 'Razão Social',
      alinhamento: 'left'
    },
    {
      campo: 'logradouroERP',
      cabecalho: 'Logradouro',
      alinhamento: 'left'
    },
    {
      campo: 'cidadeERP',
      cabecalho: 'Cidade',
      alinhamento: 'left'
    },
    {
      campo: 'vrLiquido',
      cabecalho: 'Vr. Líquido',
      alinhamento: 'right',
      format: ( rs ) => clsFormato.currency( rs )
    }
  ]

  const contexto = useContext( ContextoGlobal ) as ContextoGlobalInterface

  const ResetDados: PedidoInterface = {
    idPessoaAutorizadaComprar: 0,
    idUnidadeFaturamento: 0,
    idCliente: 0,
    idCondicaoPagamento: CONDICAO_PAGAMENTO_PADRAO,
    idMeioPagamento: MEIO_PAGAMENTO_PADRAO,
    idNaturezaOperacao: NATUREZA_OPERACAO,
    observacao: '',
    perDesconto: 0,
    vrDesconto: 0,
    perAcrescimo: 0,
    vrAcrescimo: 0,
    vrBruto: 0,
    vrLiquido: 0,
    pedidoItens: [],
    pagamentos: [],
    idPedidoERP: 0,
    idEmpresa: 0,
    idRepresentante: contexto.loginState.idRepresentante,
    codigoClienteERP: 0,
    nomeFantasiaERP: '',
    nomeClienteERP: '',
    logradouroERP: '',
    cidadeERP: '',
    destacarDesconto: false
  }

  const TituloForm = {
    [StatusForm.Incluindo]: 'Inclusão de Pedido',
    [StatusForm.Excluindo]: 'Exclusão de Pedido',
    [StatusForm.Pesquisando]: 'Pesquisa de Pedidos',
    [StatusForm.Editando]: 'Alteração de Dados de Pedido',
    [StatusForm.Exibindo]: 'Dados do Pedido'
  }

  const { mensagemState, setMensagemState } = contexto

  const [dados, setDados] = useState<PedidoInterface>( ResetDados )

  const [erros, setErros] = useState<Record<string, string>>( {} )

  const [pesquisa, setPesquisa] = useState<PesquisaInterface>( {
    descricao: '',
    inicio: DateTime.now().toFormat( 'yyyy-MM-dd' ),
    termino: DateTime.now().toFormat( 'yyyy-MM-dd' ),
    empresa: [],
    idRepresentante: [{ idRepresentante: contexto.loginState.idRepresentante, nomeERP: contexto.loginState.nome }],
    status: []
  } )
  const [mensagemAvisoFinanceiro, setMensagemAvisoFinanceiro] = useState<string>( '' )

  const [rsPesquisa, setRsPesquisa] = useState<Array<PedidoInterface>>( [] )

  const clsApi = new BackEndAPI()

  const navigate = useNavigate()

  const validarDados = (): boolean => {

    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    let clsValidacao = new ClsValidacao()

    retorno = clsValidacao.naoVazio( 'idPessoaAutorizadaComprar', dados, erros, retorno )
    retorno = clsValidacao.naoVazio( 'idUnidadeFaturamento', dados, erros, retorno )
    retorno = clsValidacao.naoVazio( 'idNaturezaOperacao', dados, erros, retorno )
    retorno = clsValidacao.naoVazio( 'idCondicaoPagamento', dados, erros, retorno )
    retorno = clsValidacao.naoVazio( 'idCliente', dados, erros, retorno )

    if ( rsPedidoItens.length === 0 ) {
      retorno = false
      erros = { ...erros, Itens: 'Adicione no mínimo um produto' }
    }

    setErros( erros )

    return retorno

  }

  const validarDadosPesquisa = (): boolean => {

    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    let clsValidacao = new ClsValidacao()

    retorno = clsValidacao.eData( 'inicio', pesquisa, erros, retorno, true )
    retorno = clsValidacao.eData( 'termino', pesquisa, erros, retorno, true )

    if ( pesquisa.inicio.length > 0 && pesquisa.termino.length > 0 ) {
      if ( DateTime.fromISO( pesquisa.inicio ) > DateTime.fromISO( pesquisa.termino ) ) {
        erros['inicio'] = 'Data maior que a Data Final'
        erros['termino'] = 'Data menor que a Data Inicial'
        retorno = false
      }
    }

    setErros( erros )

    return retorno

  }

  const clsCrud: ClsCrud<PedidoInterface> = new ClsCrud(
    navigate,
    ResetDados,
    setStatusForm,
    setDados,
    setErros,
    mensagemState,
    setMensagemState,
    setRsPesquisa,
    contexto,
    validarDados,
    {
      confirmarMutation: 'updatePedido',
      excluirMutation: 'delPedido',
      campoId: 'idPedido',
      camposPesquisa: '{idPedido idPedidoERP createdAt situacaoPedidoERP empresaERP codigoClienteERP nomeFantasiaERP nomeClienteERP logradouroERP cidadeERP vrLiquido}',
      pesquisaQuery: 'getPedidos',
      pesquisaPorId: 'getPedidoPorId',
      camposPesquisaPorId: '{idPedido idPedidoERP idRepresentante idUnidadeFaturamento idPessoaAutorizadaComprar idNaturezaOperacao idCliente idCondicaoPagamento observacao vrBruto perDesconto vrDesconto perAcrescimo vrAcrescimo vrLiquido idEmpresa codigoClienteERP nomeFantasiaERP nomeClienteERP logradouroERP cidadeERP}'
    },
    {
      confirmando: 'Atualizando Pedido',
      erroCadastro: 'Erro ao Cadastrar Pedido',
      erroExclusao: 'Erro ao Excluir Pedido',
      erroPesquisa: 'Erro ao Pesquisar Pedido',
      pesquisando: 'Pesquisando Dados de Pedidos...',
      sucessoCadastro: 'Pedido Cadastrado com sucesso!',
      atualizacaoSucesso: 'Pedido Atualizado com sucesso!',
      tituloConfirmado: 'Confirmado!',
      sucessoExclusao: 'Pedido Excluído com sucesso...',
      tituloConfirmacaoExclusao: 'Confirma?',
      tituloErroCadastro: 'Erro!',
      tituloErroExclusao: 'Erro!',
      tituloErroPesquisa: 'Erro!',
      excluindo: 'Excluindo Pedido...'
    }
  )

  const onChangeUnidadeFaturamento = ( rs: rsERPUnidadeFaturamentoInterface ) => {

    if ( rs && rs.ID_UNIDADE_FAT_CLIENTE ) {
      setRsERPUnidadeFaturamento( rs )
      pesquisarPessoasAutorizadas( rs.ID_UNIDADE_FAT_CLIENTE, rs.ID_CLIENTE ).then( () => {
        pesquisarLimiteFinanceiro( rs.ID_CLIENTE ).then( () => {
          // Pesquisa pela Padrão pois dentro do pesquisarPessoasAutorizadas a condição é setada para padrão
          atualizarValoresDeProdutos( rs.ID_UNIDADE_FAT_CLIENTE, CONDICAO_PAGAMENTO_PADRAO )
        } )
      } )
    } else {
      setRsERPUnidadeFaturamento( ResetERPUnidadeFaturamento )
      setDados( ResetDados )
      setRsPessoasAutorizadasComprar( [] )
      setRsLimiteCredito( ResetERPLimiteCredito )
      setMensagemAvisoFinanceiro( '' )
    }

  }

  /*
  const onChangeCondicaoPagamento = ( rs: rsERPCondicaoPagamentoInterface ) => {

    if ( rs && rs.ID_CONDICAO_PAGAMENTO ) {
      setDados( { ...dados, idCondicaoPagamento: rs.ID_CONDICAO_PAGAMENTO, idMeioPagamento: rs.ID_MEIO_PAGAMENTO } )
      if ( dados.idUnidadeFaturamento > 0 ) {
        atualizarValoresDeProdutos( dados.idUnidadeFaturamento, rs.ID_CONDICAO_PAGAMENTO )
      }
    }

  }
    */

  const pesquisarPessoasAutorizadas = ( idUnidadeFatCliente: number, idCliente: number ): Promise<() => void> => {
    const query: string = `
      getERPPessoasAutorizadasAComprar (ID_CLIENTE: ${idCliente}) {
        ID_PESSOA
        NOME
      }
    `

    return clsApi.query<Array<rsERPPessoaAutorizadaAComprarInterface>>( query, 'getERPPessoasAutorizadasAComprar', 'Pesquisando Autorizados a Comprar...', contexto, abortController ).then( ( rs ) => {

      setRsPessoasAutorizadasComprar( rs )

      if ( rs.length >= 1 ) {
        setDados( { ...dados, idUnidadeFaturamento: idUnidadeFatCliente, idPessoaAutorizadaComprar: rs[0].ID_PESSOA, idCliente: idCliente, idCondicaoPagamento: CONDICAO_PAGAMENTO_PADRAO } )
      } else {
        setDados( { ...dados, idUnidadeFaturamento: idUnidadeFatCliente, idPessoaAutorizadaComprar: 0, idCliente: idCliente, idCondicaoPagamento: CONDICAO_PAGAMENTO_PADRAO } )
      }

      return () => {
        abortController.abort()
      }

    } )
  }

  const pesquisarLimiteFinanceiro = ( idCliente: number ): Promise<() => void> => {
    const query: string = `
      getERPLimiteCredito (ID_CLIENTE: ${idCliente}) {
        ID_CLIENTE
        HABIL_PARA_COMPRA
        NAO_AVALIAR_FINANCEIRO
        LIMITE_CREDITO
        DIAS_CARENCIA_SALDO_VENC
        VR_TIT_VENC_FOR_CAR
        VR_TITULOS_EM_ABERTO
        CONDICOES_PAGAMENTO {
          ID_TIPO_PAGAMENTO
          ID_CONDICAO_PAGAMENTO
          ID_MEIO_PAGAMENTO
          DESCRICAO
          NUMEROPARCELAS
        }
      }
    `

    return clsApi.query<rsERPLimiteCreditoInterface>( query, 'getERPLimiteCredito', 'Pesquisando Limites de Crédito...', contexto, abortController ).then( ( rs ) => {

      let mensagem: string = ''

      if ( !rs.HABIL_PARA_COMPRA ) {
        mensagem = 'Cliente inabilitado para compra. '
      }

      if ( !rs.NAO_AVALIAR_FINANCEIRO ) {
        if ( rs.VR_TIT_VENC_FOR_CAR > 0 ) {
          mensagem = mensagem.concat( 'Títulos vencidos. Condição de pagamento somente a vista. ' )
        }

        if ( rs.VR_TITULOS_EM_ABERTO > rs.LIMITE_CREDITO ) {
          mensagem = mensagem.concat( 'Limite de compra excedido. Sujeito a análise financeira. ' )
        }
      }

      setMensagemAvisoFinanceiro( mensagem )

      rs.CONDICOES_PAGAMENTO.sort( ( a, b ) => a.ID_CONDICAO_PAGAMENTO > b.ID_CONDICAO_PAGAMENTO ? 1 : a.ID_CONDICAO_PAGAMENTO < b.ID_CONDICAO_PAGAMENTO ? -1 : 0 )

      setRsLimiteCredito( rs )

      return () => {

        abortController.abort()
      }

    } )
  }

  const atualizarValoresDeProdutos = ( idUnidadeFaturamento: number, idCondicaoPagamento: number ) => {

    if ( idUnidadeFaturamento > 0 && idCondicaoPagamento > 0 && rsPedidoItens.length > 0 ) {

      const query: string = `
        getERPAtualizarValoresItensPedido (
          rsPedidosItens: ${clsUtils.ConverterEmGql( rsPedidoItens )},
          idUnidadeFaturamento: ${idUnidadeFaturamento},
          idRepresentante: ${contexto.loginState.idRepresentante},
          idCondicaoPagamento: ${idCondicaoPagamento}
        ) {
          idPedido
          idEmpresa
          idCentroEstoque
          descricaoCentroEstoque
          descricaoProduto
          idProduto
          perDesconto
          vrDesconto
          perAcrescimo
          vrAcrescimo
          vrUnitario
          vrTotal
          vrLiquido
          saldoEstoque
          permitirEstoqueNegativo
          perComissao
          quantidade
          desconto
          vrSugerido
          vrMinimo
          vrMaximo
          idUnidadeMedida
        }
      `

      clsApi.query<Array<PedidoItemInterface>>( query, 'getERPAtualizarValoresItensPedido', 'Atualizando Valores de Produtos...', contexto, abortController ).then( ( rs ) => {

        setRsPedidoItens( rs )

      } ).catch( ( e ) => {

        setRsPedidoItens( [] )

        setMensagemState( {
          cb: null,
          exibir: true,
          exibirBotao: true,
          mensagem: 'Erro na Consulta do ERP - '.concat( e ),
          tipo: MensagemTipo.Error,
          titulo: 'Erro ERP!'
        } )

      } )

      return () => {

        abortController.abort()
      }

    }

  }

  const onConfirmarPedido = () => {

    if ( validarDados() ) {

      let rsPedido: PedidoInterface = JSON.parse( JSON.stringify( dados ) )
      rsPedido.pedidoItens = JSON.parse( JSON.stringify( rsPedidoItens ) )

      rsPedido.logradouroERP = rsERPUnidadeFaturamento.LOGRADOURO
      rsPedido.cidadeERP = rsERPUnidadeFaturamento.CIDADE
      rsPedido.codigoClienteERP = rsERPUnidadeFaturamento.CODIGO_CLIENTE
      rsPedido.nomeFantasiaERP = rsERPUnidadeFaturamento.NOME_FANTASIA
      rsPedido.nomeClienteERP = rsERPUnidadeFaturamento.NOME

      rsPedido.pagamentos.forEach( ( v, i ) => {
        rsPedido.pagamentos[i].datasEValores = JSON.stringify( v.datasEValores ) as any
      } )

      const mutation: string = `
        incluirPedido (
          pedido: ${clsUtils.ConverterEmGql( rsPedido )}) {
            idPedido
            idEmpresa
            mensagem
          }         
      `

      clsApi.mutation<Array<rsIncluirPedidoInterface>>( mutation, 'incluirPedido', 'Incluindo Pedido...', contexto, abortController ).then( ( rsPedidosIncluidos ) => {

        // Exclui Itens que foram incluídos com sucesso - restará os com problemas que ficarão na mesma tela do usuário

        let tmpPedidoItens: Array<PedidoItemInterface> = []
        let mensagem: string = 'Erro na Inclusão do Pedido no ERP.'

        rsPedidosIncluidos.forEach( rs => {
          if ( rs.idPedido === 0 ) {
            mensagem = mensagem.concat( ' Empresa ', rs.idEmpresa.toString(), ' - ', rs.mensagem )
          }
        } )

        rsPedidoItens.forEach( rs => {
          const indice = rsPedidosIncluidos.findIndex( v => v.idEmpresa === rs.idEmpresa && v.idPedido > 0 )

          if ( indice < 0 ) {
            tmpPedidoItens.push( rs )
          }

        } )

        if ( tmpPedidoItens.length > 0 ) {
          setRsPedidoItens( tmpPedidoItens )
          onTotalizarPedido( tmpPedidoItens )

          setMensagemState( {
            cb: null,
            exibir: true,
            exibirBotao: true,
            mensagem: mensagem,
            tipo: MensagemTipo.Error,
            titulo: 'Erro ERP!'
          } )

        } else {

          setDados( ResetDados )
          setRsERPUnidadeFaturamento( ResetERPUnidadeFaturamento )
          setRsLimiteCredito( ResetERPLimiteCredito )
          setStatusForm( StatusForm.Pesquisando )
          setRsPedidoItens( [] )
          setMensagemAvisoFinanceiro( '' )

          const mensagem = rsPedidosIncluidos.length > 1 ? 'Pedidos incluídos no ERP: ' : 'Pedido '.concat( rsPedidosIncluidos[0].idPedido.toString(), ' incluído no ERP.' )

          setMensagemState( {
            cb: null,
            exibir: true,
            exibirBotao: true,
            mensagem: mensagem,
            tipo: MensagemTipo.Info,
            titulo: 'Inclusão OK!'
          } )

        }

      } ).catch( ( e ) => {

        setMensagemState( {
          cb: null,
          exibir: true,
          exibirBotao: true,
          mensagem: 'Erro na Inclusão do Pedido no ERP - '.concat( e ),
          tipo: MensagemTipo.Error,
          titulo: 'Erro ERP!'
        } )

      } )

      return () => {

        abortController.abort()
      }


    }

  }

  const onTotalizarPedido = ( rs: Array<PedidoItemInterface> ) => {

    let totalizador = {
      perDesconto: 0,
      vrDesconto: 0,
      perAcrescimo: 0,
      vrAcrescimo: 0,
      vrBruto: 0,
      vrLiquido: 0
    }

    rs.forEach( v => {
      totalizador.vrDesconto += v.vrDesconto
      totalizador.vrAcrescimo += v.vrAcrescimo
      totalizador.vrBruto += parseFloat( ( ( v.vrUnitario ) * v.quantidade ).toFixed( 2 ) )
    } )

    totalizador.vrLiquido = parseFloat( ( totalizador.vrBruto + totalizador.vrAcrescimo - totalizador.vrDesconto ).toFixed( 2 ) )
    totalizador.perDesconto = parseFloat( ( totalizador.vrDesconto / totalizador.vrBruto * 100 ).toFixed( 2 ) )
    totalizador.perAcrescimo = parseFloat( ( totalizador.vrAcrescimo / totalizador.vrBruto * 100 ).toFixed( 2 ) )

    setDados( { ...dados, ...totalizador } )

  }

  const onKeyPesquisa = () => {

    if ( validarDadosPesquisa() ) {
      const objPesquisa: PedidoPesquisaInterface = {
        descricao: pesquisa.descricao,
        empresa: pesquisa.empresa.map( v => v.id ),
        idRepresentante: pesquisa.idRepresentante.map( v => v.idRepresentante ),
        inicio: pesquisa.inicio,
        status: pesquisa.status.map( v => v.id ),
        termino: pesquisa.termino
      }

      clsCrud.onClickPesquisa( objPesquisa, mensagemState )
    }

  }

  const [exibirPedido, setExibirPedido] = useState<boolean>( false )
  const [rsPedidoExibir, setRsPedidoExibir] = useState<PedidoInterface>( ResetDados )

  const btExibirPedido = ( rs: PedidoInterface ) => {
    // console.log( 'Acionador: ', rs )
    setRsPedidoExibir( rs )
    setExibirPedido( true )
  }

  const onSetPagamentos = ( idEmpresa: number, rs: Array<PedidoPagamentoInterface> ) => {

    let tmpPagamentos: Array<PedidoPagamentoInterface> = JSON.parse( JSON.stringify( dados.pagamentos ) )

    tmpPagamentos = tmpPagamentos.filter( ( rsPgto ) => rsPgto.idEmpresa !== idEmpresa ).concat( rs )

    setDados( { ...dados, pagamentos: tmpPagamentos } )

  }

  const onChangeNaturezaOperacao = ( rs: rsERPNaturezaOperacaoInterface ) => {
    if ( rs && rs.ID_NATUREZA_OPERACAO ) {
      setDados( { ...dados, idNaturezaOperacao: rs.ID_NATUREZA_OPERACAO } )
    } else {
      setDados( { ...dados, idNaturezaOperacao: 0 } )
    }
    setRsPedidoItens( [] )
  }

  const onFecharExibicao = ( pedidoCancelado: boolean ) => {

    if ( pedidoCancelado ) {
      setExibirPedido( false )
      setRsPedidoExibir( ResetDados )
      onKeyPesquisa()
    } else {
      setExibirPedido( false )
    }

  }

  const somaDosPedidos = (): string => {

    let total: number = 0

    rsPesquisa.forEach( v => {
      total += v.vrLiquido
    } )

    return clsFormato.currency( total )

  }

  return (
    <>

      <PedidoShow exibir={exibirPedido} onFecharExibicao={onFecharExibicao} idPedidoERP={rsPedidoExibir.idPedidoERP} />

      <Container maxWidth="lg" sx={{ mt: 5, }}>

        <Grid container sx={{ display: 'flex', alignItems: 'stretch' }}>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography component="h5" variant="h5" align="left">
              Cadastro de Pedidos
              <Typography variant="body2" gutterBottom>
                {TituloForm[statusForm]}
              </Typography>
            </Typography>

            <IconButton onClick={() => clsCrud.btFechar()}>
              <CloseIcon />
            </IconButton>
          </Grid>

          <Condicional condicao={statusForm === StatusForm.Pesquisando}>

            <Grid item xs={12} >

              <SelectMultiplo
                fieldsRetornoObjeto={['id']}
                dados={pesquisa}
                field='empresa'
                fieldIdSelect='id'
                fieldSelect='descricao'
                label='Empresas'
                setState={setPesquisa}
                pesquisaInicial={{
                  mensagem: 'Pesquisando Empresas....',
                  objRetorno: 'getEmpresas',
                  pesquisa: 'getEmpresas',
                  tipo: 'Query'
                }}
              />

            </Grid>

            <Grid item xs={12} >

              <SelectMultiplo
                fieldsRetornoObjeto={['idRepresentante']}
                dados={pesquisa}
                field='idRepresentante'
                fieldIdSelect='idRepresentante'
                fieldSelect='nomeERP'
                label='Representantes'
                setState={setPesquisa}
                disabled={!clsAcesso.chkAcesso( contexto.loginState.permissoes, SISTEMA_PERMISSOES.PEDIDOS.MODULO, SISTEMA_PERMISSOES.PEDIDOS.PERMISSOES.PESQUISAR_PEDIDOS_OUTROS_REPRESENTANTES )}
                pesquisaInicial={{
                  mensagem: 'Pesquisando Representantes....',
                  objRetorno: 'getRepresentantes',
                  pesquisa: 'getRepresentantes {idRepresentante nomeERP}',
                  tipo: 'Query'
                }}
              />

            </Grid>

            <Grid item xs={12} >

              <SelectMultiplo
                fieldsRetornoObjeto={['id']}
                dados={pesquisa}
                field='status'
                fieldIdSelect='id'
                fieldSelect='descricao'
                label='Situação do Pedido'
                setState={setPesquisa}
                pesquisaInicial={{
                  mensagem: 'Pesquisando Situações do Pedido....',
                  objRetorno: 'getSituacoesPedidos',
                  pesquisa: 'getSituacoesPedidos',
                  tipo: 'Query'
                }}
              />

            </Grid>

            <Grid item xs={12} sm={7}>

              <InputText
                tipo='uppercase'
                dados={pesquisa}
                field='descricao'
                label='Pesquisar Pedidos (Número Pedido ou Nome Cliente)'
                setState={setPesquisa}
              />

            </Grid>

            <Grid item xs={5} sm={2} sx={{ pl: { sm: 1 } }} >

              <InputText
                dados={pesquisa}
                field='inicio'
                label='Início'
                textAlign='right'
                setState={setPesquisa}
                tipo='date'
                erros={erros}
              />

            </Grid>

            <Grid item xs={5} sm={2} sx={{ pl: { xs: 1 } }} >

              <InputText
                dados={pesquisa}
                field='termino'
                label='Término'
                textAlign='right'
                setState={setPesquisa}
                tipo='date'
                erros={erros}
              />

            </Grid>

            <Grid item xs={2} sm={1} textAlign='center' sx={{ mt: 4.5 }}>

              <IconButton aria-label="delete" color="primary" onClick={() => onKeyPesquisa()}>
                <SearchIcon />
              </IconButton>

            </Grid>

            <Grid item xs={12} textAlign='right' sx={{ mt: 2 }}>
              <Button variant='contained' disabled={contexto.loginState.idRepresentante === 0} onClick={() => clsCrud.btIncluir()}>Incluir</Button>
            </Grid>

          </Condicional>

          <Condicional condicao={statusForm !== StatusForm.Pesquisando}>

            <Grid item xs={11}>

              <PesquisarTabela<rsERPUnidadeFaturamentoInterface>
                setState={setDados}
                field='ID_UNIDADE_FAT_CLIENTE'
                fieldSet='idUnidadeFaturamento'
                label='Cliente'
                dados={dados}
                campoQueryPesquisaID='ID_UNIDADE_FAT_CLIENTE'
                campoQueryPesquisa='pesquisa'
                camposRetornoQueryPesquisa='{ID_UNIDADE_FAT_CLIENTE ID_PESSOA ID_CLIENTE CODIGO_CLIENTE NOME NOME_FANTASIA LOGRADOURO NUMERO BAIRRO CIDADE CNPJ INSCRICAO_ESTADUAL ATIVO}'
                campoLabelQueryPesquisa='NOME'
                nomeQueryPesquisa='getERPUnidadeFaturamento'
                nomeQueryPesquisaID='getERPUnidadeFaturamentoPorId'
                mensagemPesquisa='Procurando Unidades de Faturamento...'
                disabled={statusForm === StatusForm.Excluindo}
                erros={erros}
                groupBy={( rs ) => rs.NOME}
                camposParaExibir={['CODIGO_CLIENTE', 'NOME', 'NOME_FANTASIA', 'LOGRADOURO', 'CIDADE', 'INSCRICAO_ESTADUAL']}
                onChange={( rs: rsERPUnidadeFaturamentoInterface ) => onChangeUnidadeFaturamento( rs )}
                valorAtribuirLimpar={''}
                inputUpperCase
              />

            </Grid>

            <Grid item xs={1} sx={{ mt: 5, textAlign: 'right' }}>
              <IconButton onClick={() => setRsExibirDados( !rsExibirDados )} >
                <Condicional condicao={!rsExibirDados}>
                  <Icon>visibility</Icon>
                </Condicional>
                <Condicional condicao={rsExibirDados}>
                  <Icon>visibility_off</Icon>
                </Condicional>
              </IconButton>
            </Grid>

            <Condicional condicao={rsExibirDados}>

              <Condicional condicao={mensagemAvisoFinanceiro.length > 0}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color={'red'}>
                    {mensagemAvisoFinanceiro}
                  </Typography>
                </Grid>
              </Condicional>

              <Grid item xs={12} md={2}>
                <ShowText
                  dados={rsERPUnidadeFaturamento}
                  field='CODIGO_CLIENTE'
                  label='Código Cliente'
                />
              </Grid>

              <Grid item xs={12} md={7} sx={{ pl: { md: 1 } }}>
                <ShowText
                  dados={rsERPUnidadeFaturamento}
                  field='NOME_FANTASIA'
                  label='Nome Fantasia'
                />
              </Grid>

              <Grid item xs={12} md={3} sx={{ pl: { md: 1 } }}>
                <ShowText
                  dados={rsERPUnidadeFaturamento}
                  field='INSCRICAO_ESTADUAL'
                  label='Inscrição Estadual'
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <ShowText
                  dados={rsERPUnidadeFaturamento}
                  field='CNPJ'
                  label='CPF/CNPJ'
                />
              </Grid>

              <Grid item xs={12} md={5} sx={{ pl: { md: 1 } }}>
                <ShowText
                  dados={rsERPUnidadeFaturamento}
                  field='LOGRADOURO'
                  label='Logradouro'
                />
              </Grid>

              <Grid item xs={12} md={4} sx={{ pl: { md: 1 } }}>
                <ShowText
                  dados={rsERPUnidadeFaturamento}
                  field='CIDADE'
                  label=' Cidade'
                />
              </Grid>

            </Condicional>

            <Grid item xs={12} md={8}>

              <ComboBox
                setState={setDados}
                campoDescricao='NOME'
                campoID='ID_PESSOA'
                dados={dados}
                field='idPessoaAutorizadaComprar'
                label='Pessoa Autorizada'
                opcoes={rsPessoasAutorizadasComprar}
              />

            </Grid>

            <Grid item xs={12} md={4} sx={{ pl: { md: 1 } }}>
              <PesquisarTabela<rsERPNaturezaOperacaoInterface>
                setState={setDados}
                field='ID_NATUREZA_OPERACAO'
                fieldSet='idNaturezaOperacao'
                label='Natureza Operação'
                dados={dados}
                campoQueryPesquisaID='ID_NATUREZA_OPERACAO'
                campoQueryPesquisa='pesquisa'
                camposRetornoQueryPesquisa='{ID_NATUREZA_OPERACAO DESCRICAO}'
                campoLabelQueryPesquisa='DESCRICAO'
                nomeQueryPesquisa='getERPNaturezaOperacao'
                nomeQueryPesquisaID='getERPNaturezaOperacaoPorId'
                mensagemPesquisa='Procurando Natureza da Operação'
                disabled={statusForm === StatusForm.Excluindo}
                erros={erros}
                inputUpperCase
                // groupBy={( unidade ) => unidade.NOME}
                onChange={( rs: rsERPNaturezaOperacaoInterface ) => onChangeNaturezaOperacao( rs )}
                valorAtribuirLimpar={0}
              />

            </Grid>

            {/*
            <Grid item xs={12} md={3} sx={{ pl: { md: 1 } }}>

              <ComboBox
                setState={setDados}
                opcoes={rsLimiteCredito.CONDICOES_PAGAMENTO}
                campoDescricao='DESCRICAO'
                campoID='ID_CONDICAO_PAGAMENTO'
                dados={dados}
                field='idCondicaoPagamento'
                label='Condição de Pagamento'
                mensagemPadraoCampoEmBranco='Selecione Condição de Pagamento'
                permitirNovaOpcao={false}
                onChange={( rs: rsERPCondicaoPagamentoInterface ) => onChangeCondicaoPagamento( rs )}
              />
            </Grid>
              */}

            <Grid item xs={12} md={10}>
              <InputText
                dados={dados}
                erros={erros}
                tipo='uppercase'
                field='observacao'
                label='Observação'
                setState={setDados}
              />
            </Grid>
            <Grid item xs={12} md={2} sx={{ textAlign: 'right', mt: 4, pl: { md: 1 } }}>
              <InputText
                width='180px'
                labelPlacement='start'
                dados={dados}
                erros={erros}
                tipo='checkbox'
                field='destacarDesconto'
                label='Destacar Desconto'
                setState={setDados}
              />
            </Grid>

          </Condicional>

          <Condicional condicao={dados.idUnidadeFaturamento > 0 && dados.idCondicaoPagamento > 0}>
            <PedidosItem
              idNaturezaOperacao={dados.idNaturezaOperacao}
              idCondicaoPagamento={dados.idCondicaoPagamento}
              idUnidadeFaturamento={dados.idUnidadeFaturamento}
              rsPedidoItens={rsPedidoItens}
              setRsPedidoItens={setRsPedidoItens}
              onTotalizarPedido={onTotalizarPedido}
            />
            <Condicional condicao={typeof erros.Itens !== 'undefined'}>
              <Typography variant='caption' textAlign='left' color='warning.main' >{erros.Itens}</Typography>
            </Condicional>
          </Condicional>

          <Condicional condicao={statusForm === StatusForm.Pesquisando}>
            <Grid item xs={12} sx={{ mt: 3 }}>
              <DataTable dados={rsPesquisa} cabecalho={Cabecalho} acoes={
                [
                  { icone: 'visibility', toolTip: 'Excluir', onAcionador: btExibirPedido },
                  // { icone: 'create', toolTip: 'Alterar', onAcionador: clsCrud.btEditar }
                ]
              } />
            </Grid>
            <Grid item xs={12} sx={{ mt: 3, textAlign: 'right' }}>
              <Typography component='div'>Total dos Pedidos: <Box fontWeight='fontWeightMedium' display='inline'>{somaDosPedidos()}</Box></Typography>
            </Grid>
          </Condicional>

          <Condicional condicao={statusForm === StatusForm.Incluindo}>

            <Grid item xs={12} sx={{ mt: 4, textAlign: 'right' }}>
              <Box
                display="flex"
                flexDirection="column"
                gap={1}
                width="100%"
                justifyContent='flex-end'
                sx={{ padding: 2 }}
              >
                <Box display="flex" justifyContent="flex-end">
                  <Typography variant="subtitle2">Vr. Bruto</Typography>
                  <Typography variant="body1" align="right" sx={{ width: '120px' }}>{clsFormato.currency( dados.vrBruto )}</Typography>
                </Box>
                <Box display="flex" justifyContent="flex-end">
                  <Typography variant="body1">{clsFormato.currency( dados.perDesconto )}</Typography>
                  <Typography variant="subtitle2">% Desconto</Typography>
                  <Typography variant="body1" align="right" sx={{ width: '120px' }}>{clsFormato.currency( dados.vrDesconto )}</Typography>
                </Box>
                <Box display="flex" justifyContent="flex-end">
                  <Typography variant="body1">{clsFormato.currency( dados.perAcrescimo )}</Typography>
                  <Typography variant="subtitle2">% Acréscimo</Typography>
                  <Typography variant="body1" align="right" sx={{ width: '120px' }}>{clsFormato.currency( dados.vrAcrescimo )}</Typography>
                </Box>
                <Box display="flex" justifyContent="flex-end">
                  <Typography variant="subtitle2">Valor Líquido</Typography>
                  <Typography variant="body1" align="right" sx={{ width: '120px' }}>{clsFormato.currency( dados.vrLiquido )}</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Condicional condicao={dados.vrLiquido > 0}>
                <PedidosPagamentos
                  rsPedidoItens={rsPedidoItens}
                  rsPedidoPagamentos={dados.pagamentos}
                  rsCondicoesPagamento={rsLimiteCredito.CONDICOES_PAGAMENTO}
                  onSetPagamentos={( idEmpresa: number, rs: Array<PedidoPagamentoInterface> ) => onSetPagamentos( idEmpresa, rs )}
                />
              </Condicional>
            </Grid>

            <Grid item xs={12} sx={{ mt: 4, textAlign: 'right' }}>
              <Button variant='contained' disabled={dados.vrLiquido === 0 || dados.vrLiquido !== parseFloat( ( dados.pagamentos.reduce( ( acc, pagamento ) => acc + pagamento.valor, 0 ).toFixed( 2 ) ) )} onClick={() => onConfirmarPedido()}>Confirmar Pedido</Button>
            </Grid>
          </Condicional>
        </Grid >
      </Container >

      <ExibirJSONDev exibir={EMDESENVOLVIMENTO && false} oque={[
        'Dados do Pedido', dados,
      ]} />

      <ExibirJSONDev exibir={EMDESENVOLVIMENTO && false} oque={[
        'Pesquisa', pesquisa,
      ]} />

      <ExibirJSONDev exibir={EMDESENVOLVIMENTO && false} oque={[
        'rsERPUnidadeFaturamento', rsERPUnidadeFaturamento,
      ]} />

      <ExibirJSONDev exibir={EMDESENVOLVIMENTO && false} oque={[
        'Limite de Crédito', rsLimiteCredito,
      ]} />

      <ExibirJSONDev exibir={EMDESENVOLVIMENTO && false} oque={[
        'Autorizados a Comprar', rsPessoasAutorizadasComprar
      ]} />

      <ExibirJSONDev exibir={EMDESENVOLVIMENTO && false} oque={[
        'Itens do Pedido', rsPedidoItens
      ]} />

    </>
  )
}