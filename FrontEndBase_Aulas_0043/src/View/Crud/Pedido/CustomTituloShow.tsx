import React from 'react'
import { Grid, Typography } from '@mui/material'

export default function CustomTituloShow ( { titulo }: { titulo: string } ) {

  return ( <>
    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: { xs: 2, sm: 1 } }}>
      <Typography variant="h6" >
        {titulo}
      </Typography>
    </Grid>
  </> )

}