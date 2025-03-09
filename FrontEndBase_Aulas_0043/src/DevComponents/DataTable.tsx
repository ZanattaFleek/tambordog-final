// Versão 2.0

import React, { useState } from 'react'
import { tableCellClasses, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useTheme, Tooltip, Collapse, Box, Typography } from '@mui/material'
import TablePagination from '@mui/material/TablePagination'
import Condicional from '../Layout/Condicional'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import Icon from '@mui/material/Icon/Icon'

export interface DataTableCabecalhoColSpanInterface {
  cabecalho: string
  alinhamento: 'left' | 'right' | 'center'
  largura: number
}

export interface DataTableCabecalhoInterface {
  campo: string
  cabecalho: string
  alinhamento?: 'left' | 'right' | 'center'
  largura?: number
  format?: ( arg: any, row: any ) => string | number | undefined
}

export interface DataTableAcaoInterface<T> {
  toolTip: string,
  onAcionador: ( arg: T, index: number ) => void
  icone: string
  corIcone?: string
  onDisabled?: ( arg: T ) => boolean
}

export interface DataTableInterface<T> {
  dados: Array<{ [key: string]: number | string }> | Array<Object>
  cabecalho: Array<DataTableCabecalhoInterface>
  acoes?: Array<DataTableAcaoInterface<T>>
  cabecalhoColSpan?: Array<DataTableCabecalhoColSpanInterface>
  onSelecionarLinha?: ( rs: { [key: string]: number | string } | Object, linha: number ) => void
  exibirPaginacao?: boolean
  rowsPerPageOptions?: Array<number | { value: number; label: string; }>
  tituloGrupo?: string
  cabecalhoGrupo?: Array<DataTableCabecalhoInterface>
  campoGrupo?: string
}

export const StyledTableCell = styled( TableCell )( ( { theme } ) => ( {
  /*
  [`&:nth-of-type(1)`]: {
    position: 'sticky',
    left: 0,
    backgroundColor: '#FFFF',
  },
  */
  [`&.${tableCellClasses.head}`]: {
    padding: 10,
    backgroundColor: theme.palette.primary.main,
    fontSize: 15,
    color: theme.palette.common.white,
    border: 0
  },
  [`&.${tableCellClasses.head}:nth-of-type(1)`]: {
    padding: 10,
    backgroundColor: theme.palette.primary.main,
    fontSize: 15,
    color: theme.palette.common.white,
    position: 'sticky',
    left: 0
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  },
  [`&.${tableCellClasses.body}:nth-of-type(1)`]: {
    fontSize: 14,
    position: 'sticky',
    left: 0,
    backgroundColor: '#FFFF'
  },
} ) );

export const StyledTableRow = styled( TableRow )( ( { theme } ) => ( {
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  },
} ) );

export default function DataTable<T> ( {
  cabecalhoColSpan = [],
  dados = [],
  cabecalho = [],
  acoes = [],
  onSelecionarLinha = undefined,
  exibirPaginacao = true,
  rowsPerPageOptions = [10, 25, { value: dados && dados.length ? dados.length : 0, label: 'Todos' }],
  tituloGrupo = '',
  campoGrupo = '',
  cabecalhoGrupo = []
}: DataTableInterface<T> ) {

  const theme = useTheme()
  const [indiceOpen, setIndiceOpen] = useState<number>( -1 )

  const [page, setPage] = useState( 0 )
  const [rowsPerPage, setRowsPerPage] = useState( 10 )

  const handleChangePage = ( event: unknown, newPage: number ) => {
    setPage( newPage )
  }

  const handleChangeRowsPerPage = ( event: React.ChangeEvent<HTMLInputElement> ) => {
    setRowsPerPage( +event.target.value )
    setPage( 0 )
  }

  const getColor = ( acao: DataTableAcaoInterface<T>, row: T ): string => {
    const disabled: boolean = acao.onDisabled ? acao.onDisabled( row ) : false

    let retorno: string = acao.corIcone ? acao.corIcone : theme.menu.corIcone

    if ( disabled ) {
      retorno = retorno.substring( 0, 1 ).concat( '66', retorno.substring( 1 ) )
    }

    return retorno

  }

  const [keyRefresh, setKeyRefresh] = useState( 1 )

  const onHandleClick = ( campo: string ) => {
    dados.sort( ( a: any, b: any ) => ( a[campo] > b[campo] ) ? 1 : ( ( b[campo] > a[campo] ) ? -1 : 0 ) )
    setKeyRefresh( keyRefresh + 1 )
  }

  return (
    <>
      <TableContainer component={Paper} >
        <Table size='small' key={keyRefresh}>
          <TableHead>

            <StyledTableRow key={'tableRow01'}>
              {cabecalhoColSpan.map( ( coluna, indice ) =>
                <StyledTableCell align={coluna.alinhamento ? coluna.alinhamento : 'left'} colSpan={coluna.largura} key={indice}>
                  {coluna.cabecalho}
                </StyledTableCell>
              )}
            </StyledTableRow>

            <StyledTableRow key={'tableRow02'}>
              <Condicional condicao={cabecalhoGrupo.length > 0}>
                <StyledTableCell key={Math.random() * 5000000} />
              </Condicional>
              {cabecalho.map( ( coluna, indice ) => (
                <StyledTableCell
                  onClick={() => onHandleClick( coluna.campo )}
                  key={indice + Math.random() * 5000000}
                  align={coluna.alinhamento ? coluna.alinhamento : 'left'}
                  style={{ minWidth: coluna.largura }}>
                  {coluna.cabecalho}
                </StyledTableCell>
              ) )}

              <Condicional condicao={acoes.length > 0}>
                <StyledTableCell key={Math.random() * 5000000}>
                  Opções
                </StyledTableCell>
              </Condicional>
            </StyledTableRow>

          </TableHead>
          <TableBody>
            {dados
              .slice( page * rowsPerPage, page * rowsPerPage + rowsPerPage )
              .map( ( row, indice ) =>

                <>
                  <StyledTableRow key={indice} onClick={() => onSelecionarLinha ? onSelecionarLinha( row, page * rowsPerPage + indice ) : ""}>

                    <Condicional condicao={cabecalhoGrupo.length > 0}>
                      <StyledTableCell>
                        <IconButton onClick={() => setIndiceOpen( indiceOpen === indice ? -1 : indice )}>
                          <Icon sx={{ color: theme.menu.corIcone }}>{indiceOpen === indice ? 'expand_less' : 'expand_more'}</Icon>
                        </IconButton>
                      </StyledTableCell>
                    </Condicional>

                    {
                      cabecalho.map( ( coluna, indice ) => {
                        return (
                          <StyledTableCell key={indice} align={coluna.alinhamento ? coluna.alinhamento : 'left'}>
                            <span dangerouslySetInnerHTML={{ __html: coluna.format ? coluna.format( ( row as any )[coluna.campo], row ) : ( row as any )[coluna.campo] }}></span>
                          </StyledTableCell>
                        )
                      } )
                    }

                    <Condicional condicao={acoes.length > 0}>
                      <StyledTableCell>
                        <Stack direction="row" spacing={1}>
                          {acoes.map( ( acao, index ) =>
                            <Tooltip title={acao.toolTip} key={index}>
                              <span>
                                <IconButton disabled={acao.onDisabled ? acao.onDisabled( row as T ) : false} onClick={() => acao.onAcionador( row as T, indice )} sx={{ mx: 0, px: 0 }} >
                                  <Icon sx={{ color: getColor( acao, row as T ) }}>{acao.icone}</Icon>
                                </IconButton>
                              </span>
                            </Tooltip>
                          )}
                        </Stack>
                      </StyledTableCell>
                    </Condicional>
                  </StyledTableRow>

                  {/* Inicio Grupo  */}

                  <Condicional condicao={indiceOpen === indice && typeof ( row as any ) !== 'undefined' && campoGrupo.length > 0 && typeof ( row as any )[campoGrupo] === 'object'}>
                    <StyledTableRow>
                      <StyledTableCell colSpan={cabecalho.length + 2}>
                        <Collapse in={indiceOpen === indice} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 'auto', mt: 0, mb: 3 }}>

                            <Table size='small'>

                              <TableHead>

                                <TableRow>
                                  <TableCell />
                                  <TableCell colSpan={cabecalhoGrupo.length} sx={{ backgroundColor: 'white' }}>
                                    <Typography variant="button" gutterBottom component="p">
                                      {tituloGrupo}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                                <StyledTableRow>
                                  <TableCell />
                                  {cabecalhoGrupo.map( ( coluna, indice ) => (
                                    <StyledTableCell
                                      key={indice + 30000}
                                      align={coluna.alinhamento ? coluna.alinhamento : 'left'}
                                      style={{ minWidth: coluna.largura, backgroundColor: 'white', color: 'black' }}>
                                      {coluna.cabecalho}
                                    </StyledTableCell>
                                  ) )}
                                </StyledTableRow>
                              </TableHead>
                              <TableBody>

                                {
                                  campoGrupo.length > 0 ? ( row as any )[campoGrupo].map( ( rsRegistro: any ) =>

                                    <StyledTableRow key={indice + Math.random() * 100000}>
                                      <StyledTableCell />
                                      {

                                        cabecalhoGrupo.map( ( coluna, indiceCabecalho ) =>
                                          <StyledTableCell key={indiceCabecalho + 1000} align={coluna.alinhamento ? coluna.alinhamento : 'left'}>
                                            {coluna.format ? coluna.format( rsRegistro[coluna.campo], rsRegistro ) : rsRegistro[coluna.campo]}
                                          </StyledTableCell>
                                        )
                                      }

                                    </StyledTableRow>

                                  ) : ''

                                }

                              </TableBody>
                            </Table>

                          </Box>
                        </Collapse>
                      </StyledTableCell>
                    </StyledTableRow>
                  </Condicional>

                  {/* Fim Grupo */}

                </>
              )

            }

            <Condicional condicao={dados.length === 0}>
              <StyledTableRow>
                <StyledTableCell colSpan={cabecalho.length + 1} style={{ textAlign: 'center' }}>
                  <p>Não Há registros!!!!</p>
                </StyledTableCell>
              </StyledTableRow>
            </Condicional>

          </TableBody>
        </Table>
      </TableContainer >
      {/*
        labelDisplayedRows={() => {return 'caca'}}
      */}
      <Condicional condicao={exibirPaginacao}>
        < TablePagination
          labelRowsPerPage="Qtd: "
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={dados.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Condicional>
    </>
  )

}