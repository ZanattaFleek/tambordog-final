import React from 'react'
import { Grid, Typography } from '@mui/material'

const sxCustomFieldShowTitulo = { mt: { xs: 1 }, textAlign: { sm: 'right' } }
const sxCustomFieldShowItem = ( textAlignDescricao: string ) => { return { mt: { md: 1 }, pl: { sm: 1 }, textAlign: textAlignDescricao } }

export default function CustomFieldShow ( { titulo, descricao = '', textAlignDescricao = 'left' }: { titulo: string, descricao?: string | number | null, textAlignDescricao?: 'left' | 'right' | 'center' } ) {

  return ( <>
    <Grid item xs={12} sm={4} md={2} sx={sxCustomFieldShowTitulo}>
      <Typography variant="body1" sx={{ fontWeight: 'bold' }} >
        {titulo}
      </Typography>
    </Grid>

    <Grid item xs={12} sm={8} md={10} sx={sxCustomFieldShowItem( textAlignDescricao )}>
      <Typography variant="body1" >
        {descricao}
      </Typography>
    </Grid>
  </> )

}