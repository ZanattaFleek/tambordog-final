import React, { useRef, useState } from 'react'
import { Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useTheme, Tooltip, Collapse, Box, Typography } from '@mui/material'
import TablePagination from '@mui/material/TablePagination'
import IconButton from '@mui/material/IconButton'
import Icon from '@mui/material/Icon/Icon'
import Condicional from '../../../Layout/Condicional'
import { DataTableInterface, StyledTableCell, StyledTableRow } from '../../../DevComponents/DataTable'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';


export default function DataTable<T> ( {
  cabecalhoColSpan = [],
  dados = [],
  cabecalho = [],
  acoes = [],
  onSelecionarLinha = undefined,
  exibirPaginacao = true,
  rowsPerPageOptions = [10, 25, { value: dados && dados.length ? dados.length : 0, label: 'Todos' }],
}: DataTableInterface<T> ) {

  const theme = useTheme()

  const [page, setPage] = useState( 0 )
  const [rowsPerPage, setRowsPerPage] = useState( 10 )

  const handleChangePage = ( event: unknown, newPage: number ) => {
    setPage( newPage )
  }

  const handleChangeRowsPerPage = ( event: React.ChangeEvent<HTMLInputElement> ) => {
    setRowsPerPage( +event.target.value )
    setPage( 0 )
  }

  const [open, setOpen] = useState( false );
  const generatedKey = useRef( 100000 )

  return (
    <>
      <TableContainer component={Paper}>
        <Table size='small'>
          <TableHead>

            <StyledTableRow>
              {cabecalhoColSpan.map( ( coluna, indice ) =>
                <StyledTableCell align={coluna.alinhamento ? coluna.alinhamento : 'left'} colSpan={coluna.largura} key={indice}>
                  {coluna.cabecalho}
                </StyledTableCell>
              )}
            </StyledTableRow>

            <StyledTableRow>

              {/*Modificado Aqui...*/}

              <StyledTableCell
                key={++generatedKey.current}
                align={'left'}
              >
              </StyledTableCell>

              {cabecalho.map( ( coluna, indice ) => (
                <StyledTableCell
                  key={indice}
                  align={coluna.alinhamento ? coluna.alinhamento : 'left'}
                  style={{ minWidth: coluna.largura }}>
                  {coluna.cabecalho}
                </StyledTableCell>
              ) )}

              <Condicional condicao={acoes.length > 0}>
                <StyledTableCell>
                  Opções
                </StyledTableCell>
              </Condicional>
            </StyledTableRow>

          </TableHead>
          <TableBody>
            {dados
              .slice( page * rowsPerPage, page * rowsPerPage + rowsPerPage )
              .map( ( row, indice ) => {

                return (
                  <React.Fragment key={generatedKey.current++}>
                    <StyledTableRow key={indice} onClick={() => onSelecionarLinha ? onSelecionarLinha( row, page * rowsPerPage + indice ) : ""}>

                      {/* Modificado Aqui... */}
                      <StyledTableCell>
                        <IconButton
                          key={++generatedKey.current}
                          aria-label="expand row"
                          size="small"
                          onClick={() => setOpen( !open )}
                        >
                          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                      </StyledTableCell>

                      {
                        cabecalho.map( ( coluna, indice ) => {
                          return (
                            <StyledTableCell key={indice} align={coluna.alinhamento ? coluna.alinhamento : 'left'}>
                              {coluna.format ? coluna.format( ( row as any )[coluna.campo], row ) : ( row as any )[coluna.campo]}
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
                                    <Icon sx={{ color: acao.corIcone ? acao.corIcone : theme.menu.corIcone }}>{acao.icone}</Icon>
                                  </IconButton>
                                </span>
                              </Tooltip>
                            )}
                          </Stack>
                        </StyledTableCell>
                      </Condicional>
                    </StyledTableRow>

                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                              Culturas
                            </Typography>
                            <Table size="small" aria-label="purchases">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Safra</TableCell>
                                  <TableCell>Cultura</TableCell>
                                  <TableCell>Material</TableCell>
                                  <TableCell align="right">Área</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {( row as any ).culturas.map( ( rsCultura: any, indice: number ) => (
                                  <TableRow key={indice}>
                                    <TableCell component="th" scope="row">
                                      {rsCultura.safra}
                                    </TableCell>
                                    <TableCell>{rsCultura.cultura}</TableCell>
                                    <TableCell>{rsCultura.materialPlantado}</TableCell>
                                    <TableCell align="right">
                                      {rsCultura.area}
                                    </TableCell>
                                  </TableRow>
                                ) )}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                )

              } )

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