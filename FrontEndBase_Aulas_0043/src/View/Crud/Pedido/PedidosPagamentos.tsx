import React, { useEffect, useState } from 'react'
import { PedidoItemInterface, PedidoPagamentoInterface, rsERPCondicaoPagamentoInterface } from '../../../ImportBackend/Interfaces/PedidoInterfaces'
import ExibirJSONDev from '../../../DevComponents/ExibirJSONDev'
import { EMDESENVOLVIMENTO } from '../../../ImportBackend/Config/emDesenvolvimento'
import PedidosPagamentosDetalhe from './PedidosPagamentosDetalhe'

interface PropsInterface {
  rsPedidoPagamentos: Array<PedidoPagamentoInterface>
  rsPedidoItens: Array<PedidoItemInterface>
  rsCondicoesPagamento: Array<rsERPCondicaoPagamentoInterface>
  onSetPagamentos: ( idEmpresa: number, pagamentos: Array<PedidoPagamentoInterface> ) => void
}

interface PedidoPagamentoPorEmpresaInterface {
  idEmpresa: number
  descricaoCentroEstoque: string
  pagamentos: Array<PedidoPagamentoInterface>
  vrTotalPedido: number
  vrTotalPgtos: number
}

export default function PedidosPagamentos ( { rsPedidoItens, rsPedidoPagamentos, rsCondicoesPagamento, onSetPagamentos }: PropsInterface ) {

  const [rsPgtoPorEmpresa, setRsPgtoPorEmpresa] = useState<Array<PedidoPagamentoPorEmpresaInterface>>( [] )

  // Personalizar Datas e Valores dos Pedidos

  useEffect( () => {

    let tmpPgtoPorEmpresa: Array<PedidoPagamentoPorEmpresaInterface> = []

    rsPedidoPagamentos.forEach( ( rsPagamento: PedidoPagamentoInterface ) => {

      let indicePgtoPorEmpresa: number = tmpPgtoPorEmpresa.findIndex( ( rsPgto ) => rsPgto.idEmpresa === rsPagamento.idEmpresa )

      if ( indicePgtoPorEmpresa < 0 ) {
        tmpPgtoPorEmpresa.push( { idEmpresa: rsPagamento.idEmpresa, pagamentos: [], vrTotalPgtos: 0, vrTotalPedido: 0, descricaoCentroEstoque: rsPagamento.descricaoCentroEstoque } )
        indicePgtoPorEmpresa = tmpPgtoPorEmpresa.length - 1
      }

      tmpPgtoPorEmpresa[indicePgtoPorEmpresa].pagamentos.push( { ...rsPagamento } )
      tmpPgtoPorEmpresa[indicePgtoPorEmpresa].vrTotalPgtos += rsPagamento.valor

    } )

    rsPedidoItens.forEach( ( rsItem ) => {

      let indicePgtoPorEmpresa: number = tmpPgtoPorEmpresa.findIndex( ( rsPgto ) => rsPgto.idEmpresa === rsItem.idEmpresa )

      if ( indicePgtoPorEmpresa < 0 ) {
        tmpPgtoPorEmpresa.push( { idEmpresa: rsItem.idEmpresa, pagamentos: [], vrTotalPgtos: 0, vrTotalPedido: 0, descricaoCentroEstoque: rsItem.descricaoCentroEstoque } )
        indicePgtoPorEmpresa = tmpPgtoPorEmpresa.length - 1
      }

      tmpPgtoPorEmpresa[indicePgtoPorEmpresa].vrTotalPedido += rsItem.vrLiquido

    } )

    tmpPgtoPorEmpresa.sort( ( a, b ) => a.idEmpresa - b.idEmpresa )

    setRsPgtoPorEmpresa( tmpPgtoPorEmpresa )

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify( rsPedidoPagamentos ), JSON.stringify( rsPedidoItens )] )

  return (
    <>
      {rsPgtoPorEmpresa.map( ( rsPgto, index ) =>

        <PedidosPagamentosDetalhe
          onSetPagamentos={onSetPagamentos}
          rsCondicoesPagamento={rsCondicoesPagamento}
          idEmpresa={rsPgto.idEmpresa}
          descricaoCentroEstoque={rsPgto.descricaoCentroEstoque}
          rsPagamentos={rsPgto.pagamentos}
          vrTotalPedidoEmpresa={rsPgto.vrTotalPedido}
          vrTotalPagamentos={rsPgto.vrTotalPgtos}
          key={index}
        />
      )}

      <ExibirJSONDev exibir={EMDESENVOLVIMENTO && true} oque={['rsPgtoPorEmpresa', rsPgtoPorEmpresa, 'rsPedidoItens', rsPedidoItens, 'rsPedidoPagamentos', rsPedidoPagamentos]} />
    </>
  )

}