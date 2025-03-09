import React, { useState } from 'react'
import PedidosPagamentos from '../View/Crud/Pedido/PedidosPagamentos'
import { CONDICOES_PAGAMENTO, RSPEDIDO } from './TesteBox.mock'
import { PedidoPagamentoInterface } from '../ImportBackend/Interfaces/PedidoInterfaces'


export default function TesteBox () {

  const [rsPedido, setRsPedido] = useState( RSPEDIDO )

  const onSetPagamentos = ( ( idEmpresa: number, rs: Array<PedidoPagamentoInterface> ) => {

    let tmpPagamentos: Array<PedidoPagamentoInterface> = JSON.parse( JSON.stringify( rsPedido.pagamentos ) )

    tmpPagamentos = tmpPagamentos.filter( ( rsPgto ) => rsPgto.idEmpresa !== idEmpresa ).concat( rs )

    //@ts-ignore
    setRsPedido( { ...rsPedido, pagamentos: tmpPagamentos } )

    console.log( { ...rsPedido, pagamentos: tmpPagamentos } )

  } )

  return ( <>
    <PedidosPagamentos
      rsPedidoItens={rsPedido.pedidoItens}
      rsPedidoPagamentos={rsPedido.pagamentos}
      rsCondicoesPagamento={CONDICOES_PAGAMENTO}
      onSetPagamentos={( idEmpresa: number, rs: Array<PedidoPagamentoInterface> ) => onSetPagamentos( idEmpresa, rs )}
    />
  </> )
}


/*
import React, { useState } from 'react'
import PedidosPagamentosPersonalizar from '../View/Crud/Pedido/PedidosPagamentosPersonalizar'
import { PedidoPagamentoPersonalizadoInterface } from '../ImportBackend/Interfaces/PedidoInterfaces'

export default function TesteBox () {

  const onConfirmarAlteracaoDatasEValores = ( rs: Array<PedidoPagamentoPersonalizadoInterface> ) => {
    console.log( rs )
  }

  const [rsExibirPagamentoPersonalizado, setRsExibirPagamentoPersonalizado] = useState<boolean>( true )

  const datas: Array<PedidoPagamentoPersonalizadoInterface> = [{
    data: '2024-11-30',
    valor: 100,
  },
  {
    data: '2024-12-30',
    valor: 100,
  }]

  return (
    <>
      <PedidosPagamentosPersonalizar
        onConfirmarAlteracaoDatasEValores={onConfirmarAlteracaoDatasEValores}
        dados={datas}
        exibir={rsExibirPagamentoPersonalizado}
        setExibir={setRsExibirPagamentoPersonalizado}
        valorTotal={200}
      />
    </>
  )
}
  */