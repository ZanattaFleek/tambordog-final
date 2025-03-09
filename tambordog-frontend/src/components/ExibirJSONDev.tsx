import React from 'react'
import Condicional from '../Layout/Condicional'
import { Grid } from '@mui/material'
import { EMDESENVOLVIMENTO } from '../backendImports/config/setupDesenvolvimento'

export default function ExibirJSONDev ( { oque, exibir = EMDESENVOLVIMENTO }: { oque: Array<any>, exibir?: boolean } ) {

  return (
    <>
      <Condicional condicao={exibir}>
        {oque.map( ( v, indice ) =>
          <Grid item xs={12} key={indice} sx={{ marginLeft: 3 }}>
            {
              typeof v === "string" ?
                <h3>{v}</h3>
                :
                <pre >
                  {JSON.stringify( v, null, 4 )}
                </pre>
            }
          </Grid>
        )}
      </Condicional >
    </>
  )

}