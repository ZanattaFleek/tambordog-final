import React, { useEffect, useRef, useState } from 'react'
import { Button, Dialog, Grid, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'
import DataTable, { DataTableCabecalhoInterface } from '../../../DevComponents/DataTable'
import ClsFormatacao from '../../../Utils/ClsFormatacao'
import ExibirJSONDev from '../../../DevComponents/ExibirJSONDev'
import { PedidoPagamentoPersonalizadoInterface } from '../../../ImportBackend/Interfaces/PedidoInterfaces'
import { StatusForm } from '../../../Utils/ClsCrud'
import Condicional from '../../../Layout/Condicional'
import InputText from '../../../DevComponents/InputText'
import ClsValidacao from '../../../Utils/ClsValidacao'
import { DateTime } from 'luxon'

interface ModalComponentInterface {
  exibir: boolean
  setExibir: React.Dispatch<React.SetStateAction<any>>
  dados: Array<PedidoPagamentoPersonalizadoInterface>
  onConfirmarAlteracaoDatasEValores: ( rs: Array<PedidoPagamentoPersonalizadoInterface> ) => void
  vrTotalPedidoCondicaoPagamento: number
}

export default function PedidosPagamentosPersonalizar ( { exibir, setExibir, dados, onConfirmarAlteracaoDatasEValores, vrTotalPedidoCondicaoPagamento }: ModalComponentInterface ) {

  const [rsDados, setRsDados] = useState<Array<PedidoPagamentoPersonalizadoInterface>>( [] )
  const clsFormatos: ClsFormatacao = new ClsFormatacao()

  const ResetDadosPagamentos: PedidoPagamentoPersonalizadoInterface = {
    data: '',
    valor: 0
  }

  const [rsResumo, setRsResumo] = useState( {
    vrTotalPedidoCondicaoPagamento: 0,
    valorFornecido: 0,
    diferenca: 0
  } )

  const [statusForm, setStatusForm] = useState<StatusForm>( StatusForm.Pesquisando )

  const [rsRegistro, setRsRegistro] = useState<PedidoPagamentoPersonalizadoInterface>( ResetDadosPagamentos )
  const rsIndex = useRef<number>( 0 )

  const [erros, setErros] = useState( {} )

  const validarDados = (): boolean => {

    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    let clsValidacao = new ClsValidacao()

    retorno = clsValidacao.eData( 'data', rsRegistro, erros, retorno )

    if ( retorno && rsRegistro.data < DateTime.now().toISODate() ) {
      erros['data'] = 'A data de vencimento não pode ser menor que a data atual.'
      retorno = false
    }

    retorno = clsValidacao.naoVazio( 'valor', rsRegistro, erros, retorno )

    setErros( erros )

    return retorno

  }

  const Cabecalho: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Vencimento',
      campo: 'data',
      alinhamento: 'right',
      format: ( rs ) => clsFormatos.dataISOtoUser( rs )
    },
    {
      cabecalho: 'Valor',
      campo: 'valor',
      alinhamento: 'right',
      format: ( rs ) => clsFormatos.currency( rs )
    }
  ]

  useEffect( () => {
    totalizarResumo( dados )
    setRsDados( dados )
    // eslint-disable-next-line
  }, [dados] )

  const btEditar = ( rs: PedidoPagamentoPersonalizadoInterface, index: number ) => {
    rsIndex.current = index
    setRsRegistro( { ...rs, valor: parseFloat( ( rs.valor + rsResumo.diferenca ).toFixed( 2 ) ) } )
    setStatusForm( StatusForm.Editando )
  }

  const onConfirmarEdicao = () => {
    if ( validarDados() ) {
      const tmpDados = [...rsDados]
      tmpDados[rsIndex.current] = rsRegistro
      setRsDados( tmpDados )
      setStatusForm( StatusForm.Pesquisando )
      totalizarResumo( tmpDados )
      setErros( {} )
    }
  }

  const btCancelar = () => {
    setStatusForm( StatusForm.Pesquisando )
  }

  const totalizarResumo = ( pgtos: PedidoPagamentoPersonalizadoInterface[] ) => {

    const tmpResumo = {
      vrTotalPedidoCondicaoPagamento: vrTotalPedidoCondicaoPagamento,
      valorFornecido: pgtos.reduce( ( acc, pagamento ) => acc + pagamento.valor, 0 ),
      diferenca: 0
    }

    // console.log( 'Resumo: ', tmpResumo )

    setRsResumo( { ...tmpResumo, diferenca: tmpResumo.vrTotalPedidoCondicaoPagamento - tmpResumo.valorFornecido } )

  }

  const onConfirmarDatasPersonalizadas = () => {
    onConfirmarAlteracaoDatasEValores( rsDados )
    setExibir( false )
  }

  return (
    <>
      <Dialog
        fullWidth
        maxWidth='sm'
        open={exibir}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Grid container sx={{ display: 'flex', alignItems: 'stretch', padding: 5 }}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography component="h5" variant="h5" align="left">
              Personalizar Pagamentos
              <Typography variant="body2" gutterBottom>
                Forneça as datas e valores dos vencimentos
              </Typography>
            </Typography>
          </Grid>

          <Condicional condicao={statusForm === StatusForm.Editando}>

            <Grid item xs={12}>

              <InputText
                dados={rsRegistro}
                field='valor'
                label='Valor'
                textAlign='right'
                setState={setRsRegistro}
                tipo='currency'
                erros={erros}
              />

            </Grid>

            <Grid item xs={12}>

              <InputText
                dados={rsRegistro}
                field='data'
                label='Vencimento'
                textAlign='right'
                setState={setRsRegistro}
                tipo='date'
                erros={erros}
              />

            </Grid>

            <Grid item xs={12} sx={{ mt: 3 }}>

              <Button variant='contained' startIcon={<CheckIcon />} sx={{ my: 1, py: 1, mr: 2 }} onClick={() => onConfirmarEdicao()}>Confirmar</Button>

              <Button variant='contained' startIcon={<CloseIcon />} sx={{ py: 1 }} onClick={() => btCancelar()}>Cancelar</Button>

            </Grid>

          </Condicional>

          <Condicional condicao={statusForm === StatusForm.Pesquisando}>
            <Grid item xs={12}>
              <DataTable<PedidoPagamentoPersonalizadoInterface>
                dados={rsDados}
                cabecalho={Cabecalho}
                acoes={[{ icone: 'edit', toolTip: 'Editar', onAcionador: ( rs, index ) => btEditar( rs, index ) }]}
              />
            </Grid>

            <Grid item xs={12}>
              <InputText
                dados={rsResumo}
                field='vrTotalPedidoCondicaoPagamento'
                label='Valor Total'
                textAlign='right'
                disabled={true}
                tipo='currency'
              />
            </Grid>


            <Condicional condicao={rsResumo.valorFornecido !== rsResumo.vrTotalPedidoCondicaoPagamento}>

              <Grid item xs={12}>
                <InputText
                  dados={rsResumo}
                  field='valorFornecido'
                  label='Valor Fornecido'
                  textAlign='right'
                  disabled={true}
                  tipo='currency'
                />
              </Grid>

              <Grid item xs={12}>
                <InputText
                  dados={rsResumo}
                  field='diferenca'
                  label='Diferença'
                  textAlign='right'
                  disabled={true}
                  tipo='currency'
                />
              </Grid>

            </Condicional>

            <Grid item xs={12} sx={{ textAlign: 'right', mt: 3 }}>
              <Button variant='contained' disabled={rsResumo.valorFornecido.toFixed( 2 ) !== rsResumo.vrTotalPedidoCondicaoPagamento.toFixed( 2 )} onClick={() => onConfirmarDatasPersonalizadas()}>Confirmar Pgtos</Button>
            </Grid>

          </Condicional>

        </Grid>

        <ExibirJSONDev exibir={false} oque={['dados', dados, 'Resumo', rsResumo]} />

      </Dialog>

    </>
  )

}