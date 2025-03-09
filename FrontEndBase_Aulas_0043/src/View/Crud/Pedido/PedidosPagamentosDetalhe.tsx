import React, { Fragment, useRef, useState } from 'react'
import { Box, Container, Grid, Icon, IconButton, Paper, Typography } from '@mui/material'
import { PedidoPagamentoInterface, PedidoPagamentoPersonalizadoInterface, rsERPCondicaoPagamentoInterface } from '../../../ImportBackend/Interfaces/PedidoInterfaces'
import ComboBox from '../../../DevComponents/ComboBox'
import InputText from '../../../DevComponents/InputText'
import ClsValidacao from '../../../Utils/ClsValidacao'
import DataTable, { DataTableCabecalhoInterface } from '../../../DevComponents/DataTable'
import ClsFormatacao from '../../../Utils/ClsFormatacao'
import ExibirJSONDev from '../../../DevComponents/ExibirJSONDev'
import { EMDESENVOLVIMENTO } from '../../../ImportBackend/Config/emDesenvolvimento'
import PedidosPagamentosPersonalizar from './PedidosPagamentosPersonalizar'
import { DateTime } from 'luxon'
import Condicional from '../../../Layout/Condicional'

interface PropsInterface {
  rsPagamentos: Array<PedidoPagamentoInterface>
  rsCondicoesPagamento: Array<rsERPCondicaoPagamentoInterface>
  onSetPagamentos: ( idEmpresa: number, pagamentos: Array<PedidoPagamentoInterface> ) => void
  vrTotalPedidoEmpresa: number
  vrTotalPagamentos: number
  idEmpresa: number
  descricaoCentroEstoque: string
  key: number
}

export default function PedidosPagamentosDetalhe ( { vrTotalPagamentos, rsPagamentos, rsCondicoesPagamento, onSetPagamentos, vrTotalPedidoEmpresa, idEmpresa, descricaoCentroEstoque, key }: PropsInterface ) {

  const ResetDados: PedidoPagamentoInterface = {
    tipoPagamentoNFeIdentificador: 0,
    idPedido: 0,
    idCondicaoPagamento: 0,
    idMeioPagamento: 0,
    valor: 0,
    datasEValores: [],
    dataValorPersonalizado: false,
    numeroParcelas: 0,
    idEmpresa: 0,
    descricaoCentroEstoque: ''
  }

  const [rsDados, setRsDados] = useState<PedidoPagamentoInterface>( ResetDados )

  const [erros, setErros] = useState( {} )

  const clsFormato: ClsFormatacao = new ClsFormatacao()

  const validarDados = (): boolean => {

    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    let clsValidacao = new ClsValidacao()

    retorno = clsValidacao.naoVazio( 'idCondicaoPagamento', rsDados, erros, retorno )
    retorno = clsValidacao.naoVazio( 'valor', rsDados, erros, retorno )

    if ( retorno ) {
      const total = rsPagamentos.reduce( ( acc, pagamento ) => acc + pagamento.valor, 0 );

      if ( parseFloat( ( total + rsDados.valor ).toFixed( 2 ) ) > vrTotalPedidoEmpresa ) {
        erros['valor'] = 'O valor excede o valor do pedido desta empresa.';
        retorno = false;
      }

    }

    setErros( erros )

    return retorno

  }

  const Cabecalho: Array<DataTableCabecalhoInterface> = [
    
    {
      campo: 'idCondicaoPagamento',
      cabecalho: 'Condição de Pagamento',
      alinhamento: 'left',
      format: ( rs ) => rsCondicoesPagamento.find( ( condicao ) => condicao.ID_CONDICAO_PAGAMENTO === rs )?.DESCRICAO
    },

    {
      campo: 'idMeioPagamento',
      cabecalho: 'Meio Pagamento',
      alinhamento: 'left'
    },

    {
      campo: 'valor',
      cabecalho: 'Valor',
      alinhamento: 'right',
      format: ( rs: number ) => clsFormato.currency( typeof rs === 'number' ? rs : 0 )
    }
  ]

  const btIncluirPagamento = () => {

    if ( validarDados() ) {

      const tmpPagamentos = [...rsPagamentos]
      const indice: number = rsPagamentos.findIndex( ( pagamento ) => pagamento.idCondicaoPagamento === rsDados.idCondicaoPagamento )

      if ( indice >= 0 ) {
        tmpPagamentos[indice] = { ...rsDados }
      } else {
        tmpPagamentos.push( { ...rsDados } )
      }

      onSetPagamentos( idEmpresa, tmpPagamentos )

      setRsDados( ResetDados )

    }

  }

  const btExcluirCondicaoPagamento = ( rs: PedidoPagamentoInterface ) => {

    onSetPagamentos( idEmpresa, rsPagamentos.filter( ( pagamento ) => pagamento.idCondicaoPagamento !== rs.idCondicaoPagamento ) )

  }

  const onChangeCondicaoPagamento = ( rs: rsERPCondicaoPagamentoInterface ) => {

    const valorPago: number = rsPagamentos.reduce( ( acc, pagamento ) => acc + pagamento.valor, 0 )

    setRsDados( {
      idCondicaoPagamento: rs.ID_CONDICAO_PAGAMENTO,
      tipoPagamentoNFeIdentificador: rs.ID_TIPO_PAGAMENTO,
      idMeioPagamento: rs.ID_MEIO_PAGAMENTO,
      valor: parseFloat( ( vrTotalPedidoEmpresa - valorPago ).toFixed( 2 ) ),
      numeroParcelas: rs.NUMEROPARCELAS,
      datasEValores: [],
      dataValorPersonalizado: false,
      idEmpresa: idEmpresa,
      descricaoCentroEstoque: descricaoCentroEstoque
    } )

  }

  // Personalizar Datas e Valores dos Pedidos

  const [rsExibirPagamentoPersonalizado, setRsExibirPagamentoPersonalizado] = useState<boolean>( false )
  const rsIndexEdicaoPgtoPersonalizado = useRef<number>( 0 )

  const btEditarDatasEValores = ( rs: PedidoPagamentoInterface, index: number ) => {

    rsIndexEdicaoPgtoPersonalizado.current = index

    if ( rs.datasEValores.length === 0 ) {

      console.log( 'Calculando Datas e Valores....' )

      let rsVencimentos: Array<PedidoPagamentoPersonalizadoInterface> = []
      let dataVencimento: DateTime = DateTime.now().plus( { month: 1 } )
      let valorResidual: number = parseFloat( rs.valor.toFixed( 2 ) )
      let valorParcela: number = parseFloat( ( vrTotalPedidoEmpresa / rs.numeroParcelas ).toFixed( 2 ) )

      for ( let contador: number = 1; contador <= rs.numeroParcelas; contador++ ) {

        if ( contador === rs.numeroParcelas ) {
          valorParcela = parseFloat( valorResidual.toFixed( 2 ) )
        } else {
          valorResidual = valorResidual - valorParcela
        }

        rsVencimentos.push( { data: clsFormato.dateParaDateSQL( dataVencimento.toJSDate() ), valor: valorParcela } )
        dataVencimento = dataVencimento.plus( { month: 1 } )

      }

      setRsDados( { ...rs, datasEValores: rsVencimentos } )

    } else {

      setRsDados( { ...rs } )

    }

    setRsExibirPagamentoPersonalizado( true )

  }

  const onConfirmarAlteracaoDatasEValores = ( rs: Array<PedidoPagamentoPersonalizadoInterface> ) => {

    const tmpDados: PedidoPagamentoInterface = { ...rsDados, datasEValores: rs }

    const tmpPagamentos = [...rsPagamentos]

    tmpPagamentos[rsIndexEdicaoPgtoPersonalizado.current] = { ...tmpDados }

    onSetPagamentos( idEmpresa, tmpPagamentos )

    setRsDados( ResetDados )

  }

  return (
    <Fragment>

      <PedidosPagamentosPersonalizar
        onConfirmarAlteracaoDatasEValores={onConfirmarAlteracaoDatasEValores}
        dados={rsDados.datasEValores}
        exibir={rsExibirPagamentoPersonalizado}
        setExibir={setRsExibirPagamentoPersonalizado}
        vrTotalPedidoCondicaoPagamento={rsDados.valor}
      />

      <Container maxWidth="md" sx={{ mt: 5 }}>

        <Paper variant="outlined" sx={{ padding: 2 }}>

          <Grid container sx={{ display: 'flex', alignItems: 'stretch' }}>

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>

              <Typography component="h5" variant="h5" align="left">
                {descricaoCentroEstoque} - {idEmpresa}
                <Typography variant="body2" gutterBottom>
                  Condições de Pagamento
                </Typography>
              </Typography>

            </Grid>

            <Grid item xs={12} md={8}>

              <ComboBox
                setState={setRsDados}
                opcoes={rsCondicoesPagamento}
                campoDescricao='DESCRICAO'
                campoID='ID_CONDICAO_PAGAMENTO'
                dados={rsDados}
                field='idCondicaoPagamento'
                label='Condição de Pagamento'
                mensagemPadraoCampoEmBranco='Selecione Condição de Pagamento'
                permitirNovaOpcao={false}
                erros={erros}
                onChange={( rs: rsERPCondicaoPagamentoInterface ) => onChangeCondicaoPagamento( rs )}
              />

            </Grid>

            <Grid item xs={12} md={3} sx={{ pl: { md: 1 } }}>

              <InputText
                dados={rsDados}
                field='valor'
                label='Valor'
                textAlign='right'
                setState={setRsDados}
                tipo='currency'
                erros={erros}
              />

            </Grid>

            <Grid item xs={12} md={1} sx={{ pl: { md: 1 }, textAlign: { xs: 'right', md: 'center' } }}>

              <IconButton sx={{ mx: 0, px: 0, mt: 5 }} onClick={() => btIncluirPagamento()}>
                <Icon>add</Icon>
              </IconButton>

            </Grid>

            <Grid item xs={12} sx={{ mt: 3 }}>

              <DataTable dados={rsPagamentos} cabecalho={Cabecalho}
                acoes={
                  [
                    { icone: 'delete', toolTip: 'Excluir', onAcionador: btExcluirCondicaoPagamento },
                    { icone: 'payments', toolTip: 'Alterar', onAcionador: btEditarDatasEValores, onDisabled: ( rs: PedidoPagamentoInterface ) => rs.idMeioPagamento !== 5 && rs.idMeioPagamento !== 7 }
                  ]
                }
              />

            </Grid>

            <Condicional condicao={vrTotalPagamentos - vrTotalPedidoEmpresa < 0}>

              <Grid item xs={12} sx={{ mt: 3 }}>

                <Box display="flex" justifyContent="flex-end">
                  <Typography variant="subtitle2">Diferença</Typography>
                  <Typography variant="body1" align="right" sx={{ width: '120px', color: 'red' }}>{clsFormato.currency( vrTotalPagamentos - vrTotalPedidoEmpresa )}</Typography>
                </Box>

              </Grid>

            </Condicional>

          </Grid>

        </Paper>

        <ExibirJSONDev exibir={EMDESENVOLVIMENTO && true} oque={[
          'rsDados.datasEValores', rsDados.datasEValores
        ]} />

      </Container>

    </Fragment>
  )

}