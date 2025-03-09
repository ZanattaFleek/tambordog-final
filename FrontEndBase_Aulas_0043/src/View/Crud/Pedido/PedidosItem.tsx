import React, { useContext, useEffect, useRef, useState } from 'react'
import { ContextoGlobal, ContextoGlobalInterface } from '../../../GlobalStates/ContextoGlobal'
import BackEndAPI from '../../../Services/BackEndAPI'
import { Button, Dialog, Grid, Stack, Typography } from '@mui/material'
import { MensagemTipo } from '../../../GlobalStates/MensagemState'
import InputText from '../../../DevComponents/InputText'
import ClsValidacao from '../../../Utils/ClsValidacao'
import { PedidoItemInterface, rsERPEstoqueProdutoInterface, rsERPProdutoInterface } from '../../../ImportBackend/Interfaces/PedidoInterfaces'
import ExibirJSONDev from '../../../DevComponents/ExibirJSONDev'
import { EMDESENVOLVIMENTO } from '../../../ImportBackend/Config/emDesenvolvimento'
import PesquisarTabela from '../../../DevComponents/PesquisarTabela'
import DataTable, { DataTableCabecalhoInterface } from '../../../DevComponents/DataTable'
import ClsFormatacao from '../../../Utils/ClsFormatacao'
import Condicional from '../../../Layout/Condicional'

interface PropsInterface {
  idNaturezaOperacao: number
  idUnidadeFaturamento: number
  idCondicaoPagamento: number
  rsPedidoItens: Array<PedidoItemInterface>
  setRsPedidoItens: React.Dispatch<React.SetStateAction<PedidoItemInterface[]>>
  onTotalizarPedido: ( rs: Array<PedidoItemInterface> ) => void
}

interface PesquisaInterface {
  descricao: string
  idProduto: number
  idUnidadeMedida: number
  descricaoProduto: string
}

enum StatusFormEnum {
  PESQUISANDO = 0,
  INCLUINDO_PRODUTO = 1,
  EDITANDO_PRODUTO = 2
}

enum CampoValorEdicaoAtualEnum {
  INICIAL = 0,
  EDICAO = 1
}

export default function PedidosItem ( { idNaturezaOperacao, idUnidadeFaturamento, idCondicaoPagamento, rsPedidoItens, setRsPedidoItens, onTotalizarPedido }: PropsInterface ) {

  const setFocusQuantidade = useRef( true )

  const contexto = useContext( ContextoGlobal ) as ContextoGlobalInterface

  const clsFormatos: ClsFormatacao = new ClsFormatacao()

  const { setMensagemState } = ( useContext( ContextoGlobal ) as ContextoGlobalInterface )

  const campoValorEdicaoAtual = useRef<CampoValorEdicaoAtualEnum>( CampoValorEdicaoAtualEnum.INICIAL )

  const abortController: AbortController = new AbortController()

  const clsApi = new BackEndAPI()

  const [erros, setErros] = useState( {} )

  const [rsStatusForm, setRsStatusForm] = useState<StatusFormEnum>( StatusFormEnum.PESQUISANDO )

  const [rsProdutos, setRsProdutos] = useState<Array<rsERPEstoqueProdutoInterface>>( [] )

  const ResetDados: PedidoItemInterface = {
    idPedidoItem: 0,
    idPedido: 0,
    idEmpresa: 0,
    idCentroEstoque: 0,
    descricaoCentroEstoque: '',
    descricaoProduto: '',
    idProduto: 0,
    tipoDescontoAcrescimoUnitario: true,
    perDescontoUnitario: 0,
    vrDescontoUnitario: 0,
    perAcrescimoUnitario: 0,
    vrAcrescimoUnitario: 0,
    perDesconto: 0,
    vrDesconto: 0,
    perAcrescimo: 0,
    vrAcrescimo: 0,
    vrUnitario: 0,
    saldoEstoque: 0,
    permitirEstoqueNegativo: false,
    vrTotal: 0,
    vrLiquido: 0,
    perComissao: 0,
    quantidade: 0,
    desconto: 0,
    vrSugerido: 0,
    vrMinimo: 0,
    vrMaximo: 0,
    idUnidadeMedida: 0,
  }

  const [rsDados, setRsDados] = useState<PedidoItemInterface>( ResetDados )
  const [rsIndiceEdicao, setRsIndiceEdicao] = useState<number>( -1 )

  const ResetPesquisa: PesquisaInterface = {
    descricao: '',
    idProduto: 0,
    idUnidadeMedida: 0,
    descricaoProduto: ''
  }

  const [pesquisa, setPesquisa] = useState<PesquisaInterface>( ResetPesquisa )

  const Cabecalho: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Estoque',
      campo: 'DESCRICAO',
      alinhamento: 'left'
    },
    {
      cabecalho: 'Saldo',
      campo: 'SALDO_QTD',
      alinhamento: 'right',
      format: ( rs ) => clsFormatos.currency( rs )
    },
    {
      cabecalho: 'Valor',
      campo: 'VALOR_UNITARIO',
      alinhamento: 'right',
      format: ( rs ) => clsFormatos.currency( rs )
    }
  ]
  const CabecalhoItens: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Produto',
      campo: 'descricaoProduto',
      alinhamento: 'left'
    },
    {
      cabecalho: 'Estoque',
      campo: 'descricaoCentroEstoque',
      alinhamento: 'left'
    },
    {
      cabecalho: 'Qtd',
      campo: 'quantidade',
      alinhamento: 'right',
      format: ( rs ) => clsFormatos.currency( rs )
    },
    {
      cabecalho: 'Vr. Unitário',
      campo: 'vrUnitario',
      alinhamento: 'right',
      format: ( rs ) => clsFormatos.currency( rs )
    },
    {
      cabecalho: 'Vr. Total',
      campo: 'vrTotal',
      alinhamento: 'right',
      format: ( rs ) => clsFormatos.currency( rs )
    },
    {
      cabecalho: '% Desc',
      campo: 'perDesconto',
      alinhamento: 'right',
      format: ( rs ) => clsFormatos.currency( rs )
    },
    {
      cabecalho: '$ Desc',
      campo: 'vrDesconto',
      alinhamento: 'right',
      format: ( rs ) => clsFormatos.currency( rs )
    },
    {
      cabecalho: '% Acréscimo',
      campo: 'perAcrescimo',
      alinhamento: 'right',
      format: ( rs ) => clsFormatos.currency( rs )
    },
    {
      cabecalho: '$ Acréscimo',
      campo: 'vrAcrescimo',
      alinhamento: 'right',
      format: ( rs ) => clsFormatos.currency( rs )
    },
    {
      cabecalho: 'Vr. Líquido',
      campo: 'vrLiquido',
      alinhamento: 'right',
      format: ( rs ) => clsFormatos.currency( rs )
    }
  ]

  const validarDados = (): boolean => {

    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    let clsValidacao = new ClsValidacao()

    retorno = clsValidacao.naoVazio( 'quantidade', rsDados, erros, retorno )

    if ( retorno ) {
      if ( rsDados.quantidade > rsDados.saldoEstoque && !rsDados.permitirEstoqueNegativo ) {
        erros.quantidade = 'Saldo menor que quantidade'
        retorno = false
      }

      if ( rsDados.perDesconto > contexto.loginState.perDescontoMaximo ) {
        erros.perDesconto = 'Desconto maior que o permitido'
        retorno = false
      }

    }

    setErros( erros )

    return retorno

  }

  const onChangeProduto = ( rs: rsERPProdutoInterface ) => {

    if ( rs && rs.ID_PRODUTO ) {

      setPesquisa( { ...pesquisa, idProduto: rs.ID_PRODUTO, idUnidadeMedida: rs.ID_UNIDADE_MEDIDA, descricaoProduto: rs.NOME } )

      pesquisarPrecos( rs.ID_PRODUTO )

    }
  }

  const pesquisarPrecos = ( idProduto: number ) => {

    const query: string = `
      getERPEstoqueProdutoValor (
        idProduto: ${idProduto},
        idUnidadeFaturamento: ${idUnidadeFaturamento},
        idRepresentante: ${contexto.loginState.idRepresentante},
        idCondicaoPagamento: ${idCondicaoPagamento},
        idNaturezaOperacao: ${idNaturezaOperacao}
      ) {
        ID_PRODUTO
        ID_EMPRESA
        ID_CENTRO_ESTOQUE
        DESCRICAO
        SALDO_QTD
        PERMITIR_ESTOQUE_NEGATIVO
        VALOR_UNITARIO
        VALOR_SUGERIDO
        PERC_COMISSAO
        VALOR_MINIMO
        VALOR_MAXIMO
        VALOR_CUSTO
      }
    `

    clsApi.query<Array<rsERPEstoqueProdutoInterface>>( query, 'getERPEstoqueProdutoValor', 'Pesquisando Produtos...', contexto, abortController ).then( ( rs ) => {

      setRsProdutos( rs )

    } ).catch( ( e ) => {

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

  const onEditarProduto = ( indice: number ) => {
    setRsDados( rsPedidoItens[indice] )
    setRsIndiceEdicao( indice )
    setRsStatusForm( StatusFormEnum.EDITANDO_PRODUTO )
  }

  const onApagarProduto = ( indice: number ) => {
    let tmp = [...rsPedidoItens]

    tmp.splice( indice, 1 )
    setRsIndiceEdicao( 0 )

    setRsPedidoItens( tmp )

    onTotalizarPedido( tmp )
  }

  const onAdicionarProduto = ( rs: rsERPEstoqueProdutoInterface ) => {

    let indice = rsPedidoItens.findIndex( v => v.idProduto === rs.ID_PRODUTO && v.idEmpresa === rs.ID_EMPRESA && v.idCentroEstoque === rs.ID_CENTRO_ESTOQUE )

    // Se produto já existe... Se não, inclui um novo...
    if ( indice >= 0 ) {
      setRsDados( rsPedidoItens[indice] )
    } else {

      const tmpDados: PedidoItemInterface = {
        idPedidoItem: 0,
        idPedido: 0,
        idEmpresa: rs.ID_EMPRESA,
        idCentroEstoque: rs.ID_CENTRO_ESTOQUE,
        descricaoCentroEstoque: rs.DESCRICAO,
        descricaoProduto: pesquisa.descricaoProduto,
        idProduto: rs.ID_PRODUTO,
        vrUnitario: rs.VALOR_SUGERIDO,
        saldoEstoque: rs.SALDO_QTD,
        permitirEstoqueNegativo: rs.PERMITIR_ESTOQUE_NEGATIVO,
        vrTotal: 0,
        vrLiquido: 0,
        perComissao: rs.PERC_COMISSAO,
        tipoDescontoAcrescimoUnitario: true,
        perDescontoUnitario: 0,
        vrDescontoUnitario: 0,
        perAcrescimoUnitario: 0,
        vrAcrescimoUnitario: 0,
        perDesconto: 0,
        vrDesconto: 0,
        perAcrescimo: 0,
        vrAcrescimo: 0,
        quantidade: 0,
        desconto: 0,
        vrSugerido: rs.VALOR_SUGERIDO,
        vrMinimo: rs.VALOR_MINIMO,
        vrMaximo: rs.VALOR_MAXIMO,
        idUnidadeMedida: pesquisa.idUnidadeMedida
      }

      indice = rsPedidoItens.length

      setRsDados( tmpDados )

      // setRsPedidoItens( [...rsPedidoItens, { ...tmpDados }] )
      // onTotalizarPedido( [...rsPedidoItens, { ...tmpDados }] )

    }

    setRsIndiceEdicao( indice )

    setRsStatusForm( StatusFormEnum.EDITANDO_PRODUTO )

    setFocusQuantidade.current = true

  }

  const btCancelarItem = () => {
    setRsDados( ResetDados )
    setRsStatusForm( StatusFormEnum.PESQUISANDO )
  }

  const btConfirmarItem = () => {
    if ( validarDados() ) {

      let tmpPedidoItens = [...rsPedidoItens]

      if ( rsIndiceEdicao >= 0 ) {
        tmpPedidoItens[rsIndiceEdicao] = { ...rsDados }
      } else {
        tmpPedidoItens.push( { ...rsDados } )
      }

      setRsPedidoItens( tmpPedidoItens )
      onTotalizarPedido( tmpPedidoItens )

      setPesquisa( ResetPesquisa )
      setRsProdutos( [] )

      setRsStatusForm( StatusFormEnum.PESQUISANDO )

      focarCampo( 'ID_PRODUTO', 'text' )
    }
  }

  const onAlterarPerDesconto = ( rs: number ) => {

    if ( campoValorEdicaoAtual.current === CampoValorEdicaoAtualEnum.INICIAL ) {

      campoValorEdicaoAtual.current = CampoValorEdicaoAtualEnum.EDICAO

      let tmpDados = { ...rsDados }

      let percentual: number = typeof rs === 'number' && tmpDados.quantidade > 0 ? rs : 0

      if ( percentual <= contexto.loginState.perDescontoMaximo ) {
        tmpDados.perDesconto = percentual
        tmpDados.perDescontoUnitario = percentual
      } else {
        setMensagemState( {
          cb: null,
          exibir: true,
          exibirBotao: true,
          mensagem: 'Desconto Excede o Limite!',
          tipo: MensagemTipo.Warning,
          titulo: 'Atenção!'
        } )
        tmpDados.perDesconto = 0
        tmpDados.perDescontoUnitario = 0
      }

      tmpDados.vrTotal = parseFloat( ( tmpDados.vrUnitario * tmpDados.quantidade ).toFixed( 2 ) )
      tmpDados.vrDesconto = parseFloat( ( tmpDados.vrTotal * tmpDados.perDesconto / 100 ).toFixed( 2 ) )
      tmpDados.vrDescontoUnitario = tmpDados.quantidade > 0 ? parseFloat( ( tmpDados.vrDesconto / tmpDados.quantidade ).toFixed( 2 ) ) : 0
      tmpDados.vrLiquido = parseFloat( ( ( tmpDados.vrTotal - tmpDados.vrDesconto ) ).toFixed( 2 ) )

      tmpDados.vrAcrescimo = 0
      tmpDados.perAcrescimo = 0
      tmpDados.vrAcrescimoUnitario = 0
      tmpDados.perAcrescimoUnitario = 0

      setRsDados( tmpDados )

    }

  }

  const onAlterarValorDesconto = ( rs: number ) => {

    // console.log( 'onAlterarValorDesconto ', rsDados.tipoDescontoAcrescimoUnitario, 'Current: ', campoValorEdicaoAtual.current )

    if ( campoValorEdicaoAtual.current === CampoValorEdicaoAtualEnum.INICIAL ) {

      // console.log( 'Calculando Valor Desconto', rsDados.tipoDescontoAcrescimoUnitario )

      campoValorEdicaoAtual.current = CampoValorEdicaoAtualEnum.EDICAO

      let tmpDados = { ...rsDados }

      // Se for DescontoUnitário, calcula os percentuais e transforma em desconto total
      if ( tmpDados.tipoDescontoAcrescimoUnitario ) {
        tmpDados.vrDescontoUnitario = rs
        rs = parseFloat( ( tmpDados.vrDescontoUnitario * tmpDados.quantidade ).toFixed( 2 ) )
      } else {
        tmpDados.vrDescontoUnitario = parseFloat( ( rs / tmpDados.quantidade ).toFixed( 2 ) )
      }

      tmpDados.perDescontoUnitario = parseFloat( ( tmpDados.vrDescontoUnitario / tmpDados.vrUnitario * 100 ).toFixed( 2 ) )

      tmpDados.vrTotal = parseFloat( ( tmpDados.vrUnitario * tmpDados.quantidade ).toFixed( 2 ) )

      let percentual: number = typeof rs === 'number' ? parseFloat( ( rs / tmpDados.vrTotal * 100 ).toFixed( 2 ) ) : 0

      if ( percentual <= contexto.loginState.perDescontoMaximo ) {
        tmpDados.perDesconto = percentual
        tmpDados.vrDesconto = rs
      } else {
        setMensagemState( {
          cb: null,
          exibir: true,
          exibirBotao: true,
          mensagem: 'Desconto Excede o Limite!',
          tipo: MensagemTipo.Warning,
          titulo: 'Atenção!'
        } )
        tmpDados.perDesconto = 0
        tmpDados.vrDesconto = 0
        tmpDados.vrDescontoUnitario = 0
        tmpDados.perDescontoUnitario = 0
      }

      // console.log( 'tmpDados.vrUnitario', tmpDados.vrUnitario )


      // tmpDados.vrTotal = parseFloat( ( tmpDados.vrUnitario * tmpDados.quantidade ).toFixed( 2 ) )
      tmpDados.vrLiquido = parseFloat( ( ( tmpDados.vrTotal - tmpDados.vrDesconto ) ).toFixed( 2 ) )
      tmpDados.vrAcrescimo = 0
      tmpDados.perAcrescimo = 0
      tmpDados.perAcrescimoUnitario = 0
      tmpDados.vrAcrescimoUnitario = 0

      setRsDados( tmpDados )

    }

  }

  const onAlterarPerAcrescimo = ( rs: number ) => {

    if ( campoValorEdicaoAtual.current === CampoValorEdicaoAtualEnum.INICIAL ) {

      campoValorEdicaoAtual.current = CampoValorEdicaoAtualEnum.EDICAO

      let tmpDados = { ...rsDados }

      let percentual: number = typeof rs === 'number' && tmpDados.quantidade > 0 ? rs : 0

      tmpDados.perAcrescimo = rs
      tmpDados.perAcrescimoUnitario = rs
      tmpDados.vrTotal = parseFloat( ( tmpDados.vrUnitario * tmpDados.quantidade ).toFixed( 2 ) )
      tmpDados.vrAcrescimo = parseFloat( ( tmpDados.vrTotal * percentual / 100 ).toFixed( 2 ) )
      tmpDados.vrAcrescimoUnitario = tmpDados.quantidade > 0 ? parseFloat( ( tmpDados.vrAcrescimo / tmpDados.quantidade ).toFixed( 2 ) ) : 0
      tmpDados.vrLiquido = parseFloat( ( ( tmpDados.vrTotal + tmpDados.vrAcrescimo ) ).toFixed( 2 ) )

      tmpDados.vrDesconto = 0
      tmpDados.perDesconto = 0
      tmpDados.vrDescontoUnitario = 0
      tmpDados.perDescontoUnitario = 0

      setRsDados( tmpDados )

    }

  }

  const onAlterarValorAcrescimo = ( rs: number ) => {

    if ( campoValorEdicaoAtual.current === CampoValorEdicaoAtualEnum.INICIAL ) {

      campoValorEdicaoAtual.current = CampoValorEdicaoAtualEnum.EDICAO

      let tmpDados = { ...rsDados }

      // Se for acréscimo unitário, calcula os percentuais e transforma em acréscimo total
      if ( tmpDados.tipoDescontoAcrescimoUnitario ) {
        tmpDados.vrAcrescimoUnitario = rs
        rs = parseFloat( ( tmpDados.vrAcrescimoUnitario * tmpDados.quantidade ).toFixed( 2 ) )
      } else {
        tmpDados.vrAcrescimoUnitario = parseFloat( ( rs / tmpDados.quantidade ).toFixed( 2 ) )
      }

      tmpDados.perAcrescimoUnitario = parseFloat( ( tmpDados.vrAcrescimoUnitario / tmpDados.vrUnitario * 100 ).toFixed( 2 ) )

      tmpDados.vrTotal = parseFloat( ( tmpDados.vrUnitario * tmpDados.quantidade ).toFixed( 2 ) )

      let percentual: number = typeof rs === 'number' ? parseFloat( ( rs / tmpDados.vrTotal * 100 ).toFixed( 2 ) ) : 0

      tmpDados.perAcrescimo = percentual
      tmpDados.vrAcrescimo = rs

      tmpDados.vrLiquido = parseFloat( ( ( tmpDados.vrTotal + tmpDados.vrAcrescimo ) ).toFixed( 2 ) )

      tmpDados.vrDesconto = 0
      tmpDados.perDesconto = 0
      tmpDados.perDescontoUnitario = 0
      tmpDados.vrDescontoUnitario = 0

      setRsDados( tmpDados )

    }


  }

  const onAlterarTipoDescontoAcrescimoUnitario = ( rs: boolean ) => {
    // console.log( campoValorEdicaoAtual.current )
    if ( campoValorEdicaoAtual.current === CampoValorEdicaoAtualEnum.INICIAL ) {
      campoValorEdicaoAtual.current = CampoValorEdicaoAtualEnum.EDICAO
      setRsDados( { ...rsDados, tipoDescontoAcrescimoUnitario: rs } )
    }
  }

  useEffect( () => {
    setRsProdutos( [] )
  }, [idNaturezaOperacao] )

  useEffect( () => {

    campoValorEdicaoAtual.current = CampoValorEdicaoAtualEnum.INICIAL

  } )

  useEffect( () => {
    // console.log( document.getElementsByName( 'quantidade' ) )

    const txtQuantidade = document.getElementsByName( 'quantidade' )[0]

    if ( txtQuantidade && setFocusQuantidade.current ) {

      setFocusQuantidade.current = false

      txtQuantidade.focus()
      //@ts-ignore
      txtQuantidade.select()
    } else {
      const txtIdProduto = document.getElementsByName( 'ID_PRODUTO' )[0]

      // console.log( txtIdProduto )
      if ( txtIdProduto ) {
        txtIdProduto.focus()
      }
    }

  } )

  const onAlterarQuantidade = ( rs: number ) => {

    let quantidade: number = typeof rs === 'number' ? rs : 0

    let tmpDados = { ...rsDados }
    tmpDados.vrTotal = parseFloat( ( tmpDados.vrUnitario * quantidade ).toFixed( 2 ) )
    tmpDados.vrLiquido = parseFloat( ( tmpDados.vrTotal - tmpDados.vrDesconto + tmpDados.vrAcrescimo ).toFixed( 2 ) )
    tmpDados.quantidade = quantidade

    setRsDados( tmpDados )

  }

  const focarCampo = ( campo: string, tipo: 'text' | 'button' ) => {

    const txtCampo = document.getElementsByName( campo )[0]

    if ( txtCampo ) {

      txtCampo.focus()
      if ( tipo === 'text' ) {
        //@ts-ignore
        txtCampo.select()
      }
    }

  }

  return (
    <>

      <Grid container sx={{ display: 'flex', alignItems: 'stretch' }}>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Typography component="h5" variant="h5" align="left">
            Itens do Pedido
            {/*
              <Typography variant="body2" gutterBottom>
              Pesquisa por Código, Auxiliar, Descrição ou Código de Barras.
              </Typography>
              */}
          </Typography>
        </Grid>

        <Condicional condicao={rsStatusForm === StatusFormEnum.PESQUISANDO}>

          <Grid item xs={12}>

            <PesquisarTabela<rsERPProdutoInterface>
              setState={setPesquisa}
              field='ID_PRODUTO'
              fieldSet='idProduto'
              label='Produto'
              dados={pesquisa}
              campoQueryPesquisaID='ID_PRODUTO'
              campoQueryPesquisa='pesquisa'
              camposRetornoQueryPesquisa='{ID_PRODUTO CODIGO_AUXILIAR NOME ATIVO ID_UNIDADE_MEDIDA}'
              campoLabelQueryPesquisa='NOME'
              nomeQueryPesquisa='getERPProduto'
              nomeQueryPesquisaID='getERPProdutoPorId'
              mensagemPesquisa='Procurando Produtos...'
              erros={erros}
              valorAtribuirLimpar={0}
              camposParaExibir={['NOME', 'ID_PRODUTO', 'CODIGO_AUXILIAR']}
              onChange={( rs: rsERPProdutoInterface ) => onChangeProduto( rs )}
              inputUpperCase
            />

          </Grid>

          <Grid item xs={12} sx={{ mt: 3 }}>
            <DataTable
              dados={rsProdutos}
              cabecalho={Cabecalho}
              acoes={[
                {
                  icone: 'add',
                  toolTip: '',
                  onAcionador: ( rs: rsERPEstoqueProdutoInterface ) => onAdicionarProduto( rs ),
                  // onDisabled: ( rs ) => ( rs.SALDO_QTD <= 0 && !rs.PERMITIR_ESTOQUE_NEGATIVO ) || rs.VALOR_SUGERIDO <= 0
                  onDisabled: ( rs ) => ( process.env.REACT_APP_CENTRO_ESTOQUE_SOMENTE_CONSULTA?.split( "," ).includes( rs.ID_EMPRESA.toString() ) ) || rs.VALOR_SUGERIDO <= 0
                }
              ]}

            />
          </Grid>

          <Grid item xs={12} sx={{ mt: 3 }}>
            <DataTable
              dados={rsPedidoItens}
              cabecalho={CabecalhoItens}
              acoes={[
                {
                  icone: 'delete',
                  toolTip: '',
                  onAcionador: ( _rs: rsERPEstoqueProdutoInterface, indice ) => onApagarProduto( indice ),
                  onDisabled: ( rs ) => rs.SALDO_QTD <= 0
                },
                {
                  icone: 'edit',
                  toolTip: '',
                  onAcionador: ( _rs: rsERPEstoqueProdutoInterface, indice ) => onEditarProduto( indice ),
                  onDisabled: ( rs ) => rs.SALDO_QTD <= 0
                }
              ]}

            />
          </Grid>

        </Condicional>

        <Condicional condicao={rsStatusForm === StatusFormEnum.EDITANDO_PRODUTO}>

          <Dialog
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            open={rsStatusForm === StatusFormEnum.EDITANDO_PRODUTO}
            onClose={() => btCancelarItem()}
          >

            <Grid container sx={{ padding: 5 }}>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {rsDados.descricaoProduto}
                </Typography>

                {/*
                <InputText
                dados={rsDados}
                field='descricaoProduto'
                label='Produto'
                disabled={true}
                />
                */}
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body1" gutterBottom>
                  {rsDados.descricaoCentroEstoque}
                </Typography>
                {/*
                <InputText
                  dados={rsDados}
                  field='descricaoCentroEstoque'
                  label='Estoque'
                  disabled={true}
                />
                */}
              </Grid>

              <Grid item xs={12}>
                <InputText
                  dados={rsDados}
                  field='vrUnitario'
                  label='Valor'
                  tipo='currency'
                  disabled={true}
                  textAlign='right'
                />
              </Grid>

              <Grid item xs={6} sx={{ pr: 1 }}>
                <InputText
                  dados={rsDados}
                  field='saldoEstoque'
                  label='Saldo'
                  tipo='currency'
                  disabled={true}
                  textAlign='right'
                />
              </Grid>

              <Grid item xs={6}>
                <InputText
                  dados={rsDados}
                  field='quantidade'
                  label='Quantidade'
                  tipo='currency'
                  textAlign='right'
                  erros={erros}
                  onChange={( rs: number ) => onAlterarQuantidade( rs )}
                  mapKeyPress={[{ key: 'Enter', onKey: () => focarCampo( 'btConfirmarItem', 'button' ) }]}
                />
              </Grid>

              <Grid item xs={6} >
                <InputText
                  dados={rsDados}
                  field='vrTotal'
                  label='Valor Total'
                  tipo='currency'
                  disabled={true}
                  textAlign='right'
                />
              </Grid>

              <Grid item xs={6} sx={{ pl: 1, mt: 3.5, textAlign: 'right', alignContent: 'end', justifyContent: 'flex-end' }}>
                <InputText
                  dados={rsDados}
                  field='tipoDescontoAcrescimoUnitario'
                  label='Aplciar D/A Unitário'
                  tipo='checkbox'
                  textAlign='right'
                  onChange={( rs ) => onAlterarTipoDescontoAcrescimoUnitario( rs )}
                />
              </Grid>

              <Condicional condicao={rsDados.tipoDescontoAcrescimoUnitario}>

                <Grid item xs={6} >
                  <InputText
                    dados={rsDados}
                    field='perDescontoUnitario'
                    label='% Desconto'
                    tipo='currency'
                    textAlign='right'
                    onChange={( rs: number ) => onAlterarPerDesconto( rs )}
                    mapKeyPress={[{ key: 'Enter', onKey: () => focarCampo( 'vrDescontoUnitario', 'text' ) }]}
                    erros={erros}
                  />
                </Grid>

                <Grid item xs={6} sx={{ pl: 1 }}>
                  <InputText
                    dados={rsDados}
                    field='vrDescontoUnitario'
                    label='$ Desconto'
                    tipo='currency'
                    textAlign='right'
                    onChange={( rs: number ) => onAlterarValorDesconto( rs )}
                    mapKeyPress={[{ key: 'Enter', onKey: () => focarCampo( 'perAcrescimoUnitario', 'text' ) }]}
                    erros={erros}
                  />
                </Grid>

                <Grid item xs={6} sx={{ pr: 1 }}>
                  <InputText
                    dados={rsDados}
                    field='perAcrescimoUnitario'
                    label='% Acréscimo'
                    tipo='currency'
                    textAlign='right'
                    setState={setRsDados}
                    erros={erros}
                    onChange={( rs: number ) => onAlterarPerAcrescimo( rs )}
                    mapKeyPress={[{ key: 'Enter', onKey: () => focarCampo( 'vrAcrescimoUnitario', 'text' ) }]}
                  />
                </Grid>

                <Grid item xs={6}>
                  <InputText
                    dados={rsDados}
                    field='vrAcrescimoUnitario'
                    label='$ Acréscimo'
                    tipo='currency'
                    textAlign='right'
                    setState={setRsDados}
                    erros={erros}
                    onChange={( rs: number ) => onAlterarValorAcrescimo( rs )}
                    mapKeyPress={[{ key: 'Enter', onKey: () => focarCampo( 'btConfirmarItem', 'button' ) }]}
                  />
                </Grid>

              </Condicional>

              <Condicional condicao={!rsDados.tipoDescontoAcrescimoUnitario}>


                <Grid item xs={6} >
                  <InputText
                    dados={rsDados}
                    field='perDesconto'
                    label='% Desconto'
                    tipo='currency'
                    textAlign='right'
                    onChange={( rs: number ) => onAlterarPerDesconto( rs )}
                    mapKeyPress={[{ key: 'Enter', onKey: () => focarCampo( 'vrDesconto', 'text' ) }]}
                    erros={erros}
                  />
                </Grid>

                <Grid item xs={6} sx={{ pl: 1 }}>
                  <InputText
                    dados={rsDados}
                    field='vrDesconto'
                    label='$ Desconto'
                    tipo='currency'
                    textAlign='right'
                    onChange={( rs: number ) => onAlterarValorDesconto( rs )}
                    mapKeyPress={[{ key: 'Enter', onKey: () => focarCampo( 'perAcrescimo', 'text' ) }]}
                    erros={erros}
                  />
                </Grid>

                <Grid item xs={6} sx={{ pr: 1 }}>
                  <InputText
                    dados={rsDados}
                    field='perAcrescimo'
                    label='% Acréscimo'
                    tipo='currency'
                    textAlign='right'
                    setState={setRsDados}
                    erros={erros}
                    onChange={( rs: number ) => onAlterarPerAcrescimo( rs )}
                    mapKeyPress={[{ key: 'Enter', onKey: () => focarCampo( 'vrAcrescimo', 'text' ) }]}
                  />
                </Grid>

                <Grid item xs={6}>
                  <InputText
                    dados={rsDados}
                    field='vrAcrescimo'
                    label='$ Acréscimo'
                    tipo='currency'
                    textAlign='right'
                    setState={setRsDados}
                    erros={erros}
                    onChange={( rs: number ) => onAlterarValorAcrescimo( rs )}
                    mapKeyPress={[{ key: 'Enter', onKey: () => focarCampo( 'quantidade', 'text' ) }]}
                  />
                </Grid>

              </Condicional>

              <Grid item xs={12}>
                <InputText
                  dados={rsDados}
                  field='vrLiquido'
                  label='Valor Líquido'
                  tipo='currency'
                  disabled={true}
                  textAlign='right'
                />
              </Grid>

              <Grid item xs={12} sx={{ mt: 2, textAlign: 'right' }}>
                <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                  <Button variant='contained' onClick={() => btCancelarItem()}>Cancelar</Button>
                  <Button variant='contained' name='btConfirmarItem' onClick={() => btConfirmarItem()}>Confirmar</Button>
                </Stack>
              </Grid>

            </Grid>

          </Dialog>

        </Condicional>

      </Grid>

      <ExibirJSONDev exibir={EMDESENVOLVIMENTO && false}
        oque={['Dados', rsDados]} />

    </>
  )

}