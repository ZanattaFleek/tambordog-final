import React, { useContext, useEffect, useState } from 'react'
import { Button, Dialog, Grid, IconButton, Typography } from '@mui/material'
import BackEndAPI from '../../../Services/BackEndAPI'
import { ContextoGlobal, ContextoGlobalInterface } from '../../../GlobalStates/ContextoGlobal'
import CloseIcon from '@mui/icons-material/Close'
import { ConsultaERP_PedidoInterface } from '../../../ImportBackend/Interfaces/ConsultaPedidoERPInterfaces'
import DataTable, { DataTableCabecalhoInterface } from '../../../DevComponents/DataTable'
import ClsFormatacao from '../../../Utils/ClsFormatacao'
import ExibirJSONDev from '../../../DevComponents/ExibirJSONDev'
import CustomTituloShow from './CustomTituloShow'
import CustomFieldShow from './CustomFieldShow'
import Condicional from '../../../Layout/Condicional'
import { SITUACAO_PEDIDO_APP } from '../../../ImportBackend/types/ConstantesDataTypes'
import { RespostaPadraoInterface } from '../../../ImportBackend/Interfaces/PadraoInterfaces'

interface ModalComponentInterface {
  exibir: boolean
  idPedidoERP: number
  onFecharExibicao ( pedidoCancelado: boolean ): void
}

export default function PedidoShow ( { exibir, idPedidoERP, onFecharExibicao }: ModalComponentInterface ) {

  const clsFormatos: ClsFormatacao = new ClsFormatacao()

  const clsApi = new BackEndAPI()
  const contexto = useContext( ContextoGlobal ) as ContextoGlobalInterface
  const { setMensagemState } = contexto
  const abortController: AbortController = new AbortController()

  const [exibirConfirmacaoCancelamento, setExibirConfirmacaoCancelamento] = useState<boolean>( false )

  const CabecalhoItens: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Produto',
      campo: 'produto',
      alinhamento: 'left'
    },
    {
      cabecalho: 'QTD',
      campo: 'quantidadeTotal',
      alinhamento: 'right'
    },
    {
      cabecalho: 'Unidade',
      campo: 'unidadeMedida',
      alinhamento: 'left'
    },
    {
      cabecalho: 'Vr Unitário',
      campo: 'valorUnitario',
      alinhamento: 'right',
      format: ( rs ) => clsFormatos.currency( rs )
    },
    {
      cabecalho: 'Vr Acréscimo',
      campo: 'valorDespesaAcessoria',
      alinhamento: 'right',
      format: ( rs ) => clsFormatos.currency( rs )
    },
    {
      cabecalho: 'Vr Desconto',
      campo: 'valorDesconto',
      alinhamento: 'right',
      format: ( rs ) => clsFormatos.currency( rs )
    },
    {
      cabecalho: 'Vr Tot Bruto',
      campo: 'valorTotalBruto',
      alinhamento: 'right',
      format: ( rs ) => clsFormatos.currency( rs )
    },
    {
      cabecalho: 'Vr Total',
      campo: 'valorTotal',
      alinhamento: 'right',
      format: ( rs ) => clsFormatos.currency( rs )
    }
  ]

  const CabecalhoTitulos: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Tipo',
      campo: 'tipoDoc',
      alinhamento: 'left'
    },
    {
      cabecalho: 'Vencimento',
      campo: 'dataVencimento',
      alinhamento: 'right',
      format: ( rs ) => clsFormatos.dateMillsParaDateUser( rs )
    },
    {
      cabecalho: 'Emissão',
      campo: 'dataEmissao',
      alinhamento: 'right',
      format: ( rs ) => clsFormatos.dateMillsParaDateUser( rs )
    },
    {
      cabecalho: 'Valor',
      campo: 'valor',
      alinhamento: 'right',
      format: ( rs ) => clsFormatos.currency( rs )
    }
  ]

  const [rsPedido, setRsPedido] = useState<ConsultaERP_PedidoInterface>()

  const pesquisarERPPedido = () => {

    if ( idPedidoERP > 0 ) {

      const query: string = `
        getERPPedido (
          idPedidoERP: ${idPedidoERP}
          ) 
      `

      clsApi.query<ConsultaERP_PedidoInterface>( query, 'getERPPedido', 'Pesquisando Pedido...', contexto, abortController ).then( ( rs ) => {

        setRsPedido( rs )

      } )

      return () => {

        abortController.abort()
      }

    }

  }

  const onCancelarPedido = () => {

    const query: string = `
      cancelarPedidoERP (
        idPedidoERP: ${idPedidoERP}
      ) {
        ok
        mensagem
        }
    `

    clsApi.mutation<RespostaPadraoInterface>( query, 'cancelarPedidoERP', 'Cancelando Pedido...', contexto ).then( ( rs ) => {

      if ( rs.ok ) {

        pesquisarERPPedido()
        setExibirConfirmacaoCancelamento( false )
        onFecharExibicao( true )

      } else {

        setMensagemState( {
          cb: null,
          exibir: true,
          exibirBotao: true,
          mensagem: rs.mensagem,
          tipo: 'error',
          titulo: 'Pedido Não Cancelado!'
        } )

      }

    } )

  }

  useEffect( () => {
    if ( idPedidoERP && idPedidoERP > 0 ) {
      pesquisarERPPedido()
    }
    // eslint-disable-next-line
  }, [idPedidoERP] )

  return (
    <>
      <Dialog
        fullWidth
        maxWidth='lg'
        open={exibir}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Grid container sx={{ display: 'flex', alignItems: 'stretch', padding: 5 }}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography component="h5" variant="h5" align="left">
              Resumo do Pedido
              <Typography variant="body2" gutterBottom>
                Dados extraídos do ERP
              </Typography>
            </Typography>

            <IconButton onClick={() => onFecharExibicao( false )}>
              <CloseIcon />
            </IconButton>
          </Grid>

          <CustomTituloShow titulo='Informações' />

          <CustomFieldShow titulo='Pedido' descricao={rsPedido?.identificador} />
          <CustomFieldShow titulo='Cliente' descricao={rsPedido?.clienteIdentificador} />
          <CustomFieldShow titulo='Unidade de Faturamento' descricao={rsPedido?.unidadeFatCliente} />
          <CustomFieldShow titulo='Empresa' descricao={rsPedido?.empresa} />
          <CustomFieldShow titulo='Situacao' descricao={rsPedido?.situacaoPedido} />
          <CustomFieldShow titulo='Valor Bruto' descricao={clsFormatos.currency( rsPedido && rsPedido.valorTotalBruto ? rsPedido.valorTotalBruto : 0 )} />
          <CustomFieldShow titulo='Valor Acréscimo' descricao={clsFormatos.currency( rsPedido && rsPedido.valorDespAcessoria ? rsPedido.valorDespAcessoria : 0 )} />
          <CustomFieldShow titulo='Valor Desconto' descricao={clsFormatos.currency( rsPedido && rsPedido.valorDesconto ? rsPedido.valorDesconto : 0 )} />
          <CustomFieldShow titulo='Valor' descricao={clsFormatos.currency( rsPedido && rsPedido.valorTotal ? rsPedido.valorTotal : 0 )} />

          <CustomTituloShow titulo='Itens do Pedido' />

          <Grid item xs={12}>
            <DataTable cabecalho={CabecalhoItens} dados={rsPedido ? rsPedido.itemPedido : []} />
          </Grid>

          <CustomTituloShow titulo='Pagamento' />

          {rsPedido?.infPagamentoPedido.map( ( item, _index ) =>
            <>
              <CustomFieldShow titulo='Condições de Pagamento' descricao={item.meioPagamento} />
              <Grid item xs={12}>
                <DataTable cabecalho={CabecalhoTitulos} dados={item.titulos} />
              </Grid>
            </>
          )}

          <CustomTituloShow titulo='Dados de Transporte' />

          <CustomFieldShow titulo='Tipo Frete' descricao={rsPedido?.tipoFrete} />
          <CustomFieldShow titulo='Transportador' descricao={rsPedido?.transportador} />
          <CustomFieldShow titulo='Saida (Previsão)' descricao={rsPedido ? clsFormatos.dateMillsParaDateUser( rsPedido.dataPrevisaoSaida as any ) : ''} />
          <CustomFieldShow titulo='Faturamento (Previsão)' descricao={rsPedido ? clsFormatos.dateMillsParaDateUser( rsPedido.dataPrevisaoFat as any ) : ''} />


          <Grid item xs={12} sx={{ textAlign: 'right' }}>

            <Condicional condicao={!exibirConfirmacaoCancelamento && rsPedido?.situacaoPedidoIdentificador === SITUACAO_PEDIDO_APP}>
              <Button onClick={() => setExibirConfirmacaoCancelamento( true )}>Cancelar Pedido</Button>
            </Condicional>

            <Condicional condicao={exibirConfirmacaoCancelamento}>
              <Button sx={{ ml: 1 }} onClick={() => onCancelarPedido()}>Confirmar Cancelamento</Button>
              <Button onClick={() => setExibirConfirmacaoCancelamento( false )}>Não Cancelar</Button>
            </Condicional>

          </Grid>

          <Grid item xs={12} sx={{ textAlign: 'right' }}>
            <Button onClick={() => onFecharExibicao( false )}>Fechar</Button>
          </Grid>

        </Grid>

        <ExibirJSONDev exibir={false} oque={['rsPedido', rsPedido]} />

      </Dialog >

    </>
  )

}