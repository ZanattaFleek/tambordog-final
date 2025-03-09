import React, { useState } from 'react'

import { Paper, Stack, Table, TableBody, TableContainer, TableHead, useTheme, Tooltip, Box, Typography } from '@mui/material'

import Condicional from '../Layout/Condicional'
import { DataTableCabecalhoInterface, StyledTableCell, StyledTableRow } from './DataTable'

import TablePagination from '@mui/material/TablePagination'
import IconButton from '@mui/material/IconButton'
import Icon from '@mui/material/Icon/Icon'

export interface PropsInterfaceDetalheJSON<T> {
  onConfirmarExclusao: () => void
  onConfirmarEdicaoInclusao: ( registro: T ) => void
  onCancelar: () => void
  open: boolean
  statusForm: StatusForm
  registro: T
  titulo: string
  dadosIniciaisRegistro: T
}

export enum StatusForm {
  Incluindo,
  Excluindo,
  Exibindo,
  Editando,
  Inicial
}

export interface DataTableCrudJSONAcaoInterface<T> {
  toolTip: string,
  onAcionador: ( arg: T, index: number ) => void
  icone: string
  corIcone?: string
  onDisabled?: ( arg: T ) => boolean
}

export interface DataTableCrudJSONInterface<T> {
  dadosIniciaisRegistro: T
  dados: Array<T>
  setState?: React.Dispatch<React.SetStateAction<Array<T>>>
  cabecalho: Array<DataTableCabecalhoInterface>
  acoes?: Array<DataTableCrudJSONAcaoInterface<T>>
  ComponenteInputCrud: React.JSXElementConstructor<PropsInterfaceDetalheJSON<T>>
  tituloCrud: string
  disabled?: boolean
  onChange?: ( arg: Array<T> ) => void
}

export default function DataTableCrudJSON<T> ( {
  dados = [],
  setState,
  cabecalho = [],
  acoes,
  disabled = false,
  ComponenteInputCrud,
  tituloCrud,
  dadosIniciaisRegistro,
  onChange = undefined
}: DataTableCrudJSONInterface<T> ) {

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

  const [statusForm, setStatusForm] = useState( StatusForm.Inicial )

  const [rsEdicao, setRsEdicao] = useState<T>( dadosIniciaisRegistro )

  const [openDialog, setOpenDialog] = useState( false )

  const [indiceAtualRsEdicao, setIndiceAtualRsEdicao] = useState( -1 )

  const btEditarExcluir = ( rs: T, index: number, statusForm: StatusForm ) => {
    setStatusForm( statusForm )
    setIndiceAtualRsEdicao( index )
    setRsEdicao( rs )
    setOpenDialog( true )
  }

  const btIncluir = () => {
    setRsEdicao( dadosIniciaisRegistro )
    setStatusForm( StatusForm.Incluindo )
    setOpenDialog( true )
    setIndiceAtualRsEdicao( -1 )
  }

  const btCancelar = () => {
    setStatusForm( StatusForm.Inicial )
    setOpenDialog( false )
  }

  const btConfirmarExclusao = () => {
    let tmpDados: Array<T> = [...dados]
    tmpDados.splice( indiceAtualRsEdicao, 1 )
    if ( setState ) {
      setState( [...tmpDados] )
    }
    setStatusForm( StatusForm.Inicial )
    setOpenDialog( false )

    if ( onChange ) {
      onChange( [...tmpDados] )
    }
  }

  const btConfirmarEdicaoInclusao = ( registro: T ) => {
    let tmpDados: Array<T> = [...dados]

    if ( indiceAtualRsEdicao >= 0 ) {
      tmpDados[indiceAtualRsEdicao] = registro
    } else {
      tmpDados.push( registro )
    }

    if ( setState ) {
      setState( tmpDados )
    }

    setOpenDialog( false )

    if ( onChange ) {
      onChange( tmpDados )
    }

  }

  const acoesCrud: Array<DataTableCrudJSONAcaoInterface<T>> = acoes ? acoes :
    [
      { icone: 'delete', toolTip: 'Excluir', onAcionador: ( rs, index ) => btEditarExcluir( rs, index, StatusForm.Excluindo ) },
      { icone: 'create', toolTip: 'Alterar', onAcionador: ( rs, index ) => btEditarExcluir( rs, index, StatusForm.Editando ) }
    ]

  let idDrag: number = -1

  const startDrop = ( e: number ) => {

    let tmpDados: Array<T> = [...dados]
    let tmpRegistro: T = tmpDados[idDrag]

    tmpDados[idDrag] = tmpDados[e]
    tmpDados[e] = tmpRegistro
    if ( setState ) {
      setState( tmpDados )

      if ( onChange ) {
        onChange( tmpDados )
      }

    }

    return undefined

  }

  const startDrag = ( e: number ) => {

    idDrag = e

    return undefined

  }

  return (
    <>
      <Condicional condicao={[StatusForm.Editando, StatusForm.Excluindo, StatusForm.Exibindo, StatusForm.Incluindo].includes( statusForm )}>
        <ComponenteInputCrud
          dadosIniciaisRegistro={dadosIniciaisRegistro}
          open={openDialog}
          registro={rsEdicao as T}
          statusForm={statusForm}
          titulo={tituloCrud}
          onCancelar={() => btCancelar()}
          onConfirmarEdicaoInclusao={( registro ) => btConfirmarEdicaoInclusao( registro )}
          onConfirmarExclusao={() => btConfirmarExclusao()}
        />
      </Condicional>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>

        <Typography component="h6" variant="h6" align="left">
          {tituloCrud}
        </Typography>

        <Stack direction="row" spacing={1}>
          <Tooltip title='Incluir'>
            <span>
              <IconButton disabled={disabled} onClick={() => btIncluir()} >
                <Icon>add</Icon>
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Box>
      {/*

      <Box onDrop={startDrop} sx={{ height: 100, width: 100, boder: 'solid', borderWidth: '1px', borderColor: 'black' }} >Aqui tem um Box Drop</Box>
      <Box onDrag={startDrag} draggable={true} sx={{ height: 100, width: 100 }} >Aqui tem um Box Drag</Box>

      <div onDragOver={( event ) => { event.preventDefault(); console.log( 'Drag Over: ', event ) }} onDrop={startDrop}>Isto é uma div</div>
  */}

      <TableContainer component={Paper}>
        <Table size='small'>
          <TableHead>
            <StyledTableRow>
              {cabecalho.map( ( coluna, indice ) => (
                <StyledTableCell
                  key={indice}
                  align={coluna.alinhamento ? coluna.alinhamento : 'left'}
                  style={{ minWidth: coluna.largura }}>
                  {coluna.cabecalho}
                </StyledTableCell>
              ) )}

              <Condicional condicao={acoesCrud.length > 0}>
                <StyledTableCell>
                  Opções
                </StyledTableCell>
              </Condicional>
            </StyledTableRow>
          </TableHead>

          <TableBody>
            {dados
              .slice( page * rowsPerPage, page * rowsPerPage + rowsPerPage )
              .map( ( row, indiceDados ) => {

                return (
                  <StyledTableRow
                    onDragStart={( _e ) => startDrag( indiceDados )}
                    onDragOver={( event ) => event.preventDefault()}
                    onDrop={( _e ) => startDrop( indiceDados )}
                    draggable
                    key={indiceDados}>
                    {
                      cabecalho.map( ( coluna, indice ) => {
                        return (
                          <StyledTableCell key={indice} align={coluna.alinhamento ? coluna.alinhamento : 'left'}>
                            {coluna.format ? coluna.format( ( row as any )[coluna.campo], row ) : ( row as any )[coluna.campo]}
                          </StyledTableCell>
                        )
                      } )
                    }

                    <Condicional condicao={acoesCrud.length > 0}>
                      <StyledTableCell>
                        <Stack direction="row" spacing={1}>
                          {acoesCrud.map( ( acao, indexAcoesCrud ) =>
                            <Tooltip title={acao.toolTip} key={indexAcoesCrud}>
                              <span>
                                <IconButton disabled={acao.onDisabled ? acao.onDisabled( row as T ) : false} onClick={() => ( acao.onAcionador as any )( row, indiceDados )} sx={{ mx: 0, px: 0 }} >
                                  <Icon sx={{ color: acao.corIcone ? acao.corIcone : theme.menu.corIcone }}>{acao.icone}</Icon>
                                </IconButton>
                              </span>
                            </Tooltip>
                          )}
                        </Stack>
                      </StyledTableCell>
                    </Condicional>
                  </StyledTableRow>
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
      < TablePagination
        labelRowsPerPage="Qtd: "
        rowsPerPageOptions={[10, 25, { value: dados && dados.length ? dados.length : 0, label: 'Todos' }]}
        component="div"
        count={dados.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  )

}