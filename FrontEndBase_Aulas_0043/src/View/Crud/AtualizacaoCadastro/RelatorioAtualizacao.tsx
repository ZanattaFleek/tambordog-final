import React, { useContext, useState } from 'react'
import { ContextoGlobal, ContextoGlobalInterface } from '../../../GlobalStates/ContextoGlobal'
import BackEndAPI from '../../../Services/BackEndAPI'
import { Button, Container, Grid, IconButton, Paper, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import InputText from '../../../DevComponents/InputText'
import ExibirJSONDev from '../../../DevComponents/ExibirJSONDev'
import ClsValidacao from '../../../Utils/ClsValidacao'
import { RelatorioAtualizacaoInterface, rsRelatorioAtualizacaoInterface } from '../../../ImportBackend/Interfaces/AtualizacaoCadastralRelatoriosInterfaces'
import { clsUtils } from 'zlib-utils'
import RelatorioAtualizacaoDataTable from './RelatorioAtualizacaoDataTable'
import { DataTableCabecalhoInterface } from '../../../DevComponents/DataTable'
import ClsExportDataTableCSV from '../../../Utils/ClsExportDataTableCSV'
import { AtualizacaoCadastroProdutorCulturaInterface } from '../../../ImportBackend/Interfaces/AtualizacaoCadastroInterfaces'

interface rsExportacaoInterface extends rsRelatorioAtualizacaoInterface, AtualizacaoCadastroProdutorCulturaInterface { }

export default function RelatorioAtualizacao () {

  const contexto = useContext( ContextoGlobal ) as ContextoGlobalInterface

  const abortController: AbortController = new AbortController()

  const navigate = useNavigate()

  const clsApi = new BackEndAPI()

  const [erros, setErros] = useState<{ [key: string]: string }>( {} )
  const ResetPesquisa: RelatorioAtualizacaoInterface = {
    inicio: '',
    termino: '',
    descricao: '',
    cultura: ''

  }

  const [pesquisa, setPesquisa] = useState<RelatorioAtualizacaoInterface>( ResetPesquisa )
  const [dados, setDados] = useState<Array<rsRelatorioAtualizacaoInterface>>( [] )

  const cabecalho: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Produtor',
      campo: 'nome'
    },
    {
      cabecalho: 'Fazenda',
      campo: 'fazenda'
    },
    {
      cabecalho: 'Município',
      campo: 'municipio',
      format: ( v: string, row: rsRelatorioAtualizacaoInterface ) => row.municipio.concat( '-', row.uf )
    }
  ]


  const btFechar = () => {
    navigate( '/' )
  }

  const validarDados = (): boolean => {

    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    let clsValidacao = new ClsValidacao()

    clsValidacao.eData( 'inicio', pesquisa, erros, retorno, true )
    clsValidacao.eData( 'termino', pesquisa, erros, retorno, true )

    if ( retorno && pesquisa.inicio.length > 0 && pesquisa.termino.length > 0 ) {
      if ( pesquisa.termino < pesquisa.inicio ) {
        erros.inicio = 'Período Inválido!'
        erros.termino = 'Período Inválido!'
        retorno = false
      }
    }

    setErros( erros )

    return retorno

  }

  const pesquisar = () => {

    const query: string = `
      relatorioAtualizacao (pesquisa: ${clsUtils.ConverterEmGql( pesquisa )}) {
        idProdutor
        nome
        idPropriedade
        fazenda
        municipio
        uf
        parceirosComerciais
        cpfCnpj
        observacao
        associado
        email
        fone
        codigocliente
        cadastradoERP
        usuarioCadastro
        culturas {
          area
          cultura
          materialPlantado
          safra
        }
      }
    `

    clsApi.query<Array<rsRelatorioAtualizacaoInterface>>( query, 'relatorioAtualizacao', 'Pesquisando Propriedades...', contexto, abortController ).then( ( rs ) => {
      setDados( rs )
    } )

    return () => {
      abortController.abort()
    }
  }

  /*
    useEffect( () => {
  
      pesquisar()
  
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [] )
  */

  const onPesquisar = () => {

    if ( validarDados() ) {
      pesquisar()
    }

  }

  const onDownload = () => {

    let rsRelatorio: Array<rsExportacaoInterface> = []

    // SAFRA 2024
    // MILHO
    // AREA
    // MATERIAL

    // SAFRA 2025
    // MILHO
    // AREA
    // MATERIAL

    if ( dados.length > 0 ) {

      let cabecalhoExportacao: Array<DataTableCabecalhoInterface> = [...cabecalho].concat( [
        { cabecalho: 'Parceiros Comerciais', campo: 'parceirosComerciais' },
        { cabecalho: 'CPF / CNPJ', campo: 'cpfCnpj' },
        { cabecalho: 'Observação', campo: 'observacao' },
        { cabecalho: 'Associado', campo: 'associado', format: ( v ) => v ? 'S' : 'N' },
        { cabecalho: 'e-mail', campo: 'email' },
        { cabecalho: 'Fone', campo: 'fone' },
        { cabecalho: 'Código Cliente ERP', campo: 'codigocliente' },
        { cabecalho: 'Cadastrado ERP', campo: 'cadastradoERP', format: ( v ) => v ? 'S' : 'N' },
        { cabecalho: 'Usuário', campo: 'usuarioCadastro' }
      ] )

      cabecalhoExportacao = cabecalhoExportacao.concat( [
        {
          cabecalho: 'Safra',
          campo: 'safra',
          alinhamento: 'left'
        },
        {
          cabecalho: 'Cultura',
          campo: 'cultura',
          alinhamento: 'left'
        },
        {
          cabecalho: 'Material',
          campo: 'materialPlantado',
          alinhamento: 'left'
        },
        {
          cabecalho: 'Área',
          campo: 'area',
          alinhamento: 'left'
        }
      ] )

      dados.forEach( rsProdutor => {
        rsProdutor.culturas.forEach( rsCultura => {
          rsRelatorio.push( { ...rsProdutor, ...rsCultura } )
        } )
      } )

      /*
      {
        cabecalho: 'Culturas',
        campo: 'culturas',
        format: ( rsCultura: Array<AtualizacaoCadastroProdutorCulturaInterface> ) => {
          let retorno: string = ''

          rsCultura.forEach( v => {
            if ( retorno.length > 0 ) {
              retorno = retorno.concat( '|' )
            }

            retorno = retorno.concat( v.safra, ',', v.cultura, ',', v.materialPlantado, ',', v.area.toString() )
          } )

          return retorno
        }
      }
*/

      const clsExportar: ClsExportDataTableCSV = new ClsExportDataTableCSV()

      clsExportar.exportCSV( 'AtualizacaoCadastral', rsRelatorio, cabecalhoExportacao )
    }

  }

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 5 }}>

        <Paper variant="outlined" sx={{ padding: 2 }}>
          <Grid container sx={{ display: 'flex', alignItems: 'stretch' }}>

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography component="h5" variant="h5" align="left">
                Atualizações Realizadas
              </Typography>

              <IconButton onClick={() => btFechar()}>
                <CloseIcon />
              </IconButton>
            </Grid>

            <Grid item xs={12}>
              <InputText
                dados={pesquisa}
                field='descricao'
                label='Pesquisar'
                setState={setPesquisa}
                erros={erros}
                tipo='uppercase'
                maxLength={55}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <InputText
                dados={pesquisa}
                field='cultura'
                label='Cultura'
                setState={setPesquisa}
                erros={erros}
                tipo='uppercase'
                maxLength={55}
              />
            </Grid>

            <Grid item xs={12} md={4} sx={{ pl: { md: 1 } }}>
              <InputText
                dados={pesquisa}
                type='tel'
                tipo='date'
                field='inicio'
                label='Início'
                setState={setPesquisa}
                erros={erros}
                mask='00/00/0000'
              />
            </Grid>

            <Grid item xs={12} md={4} sx={{ pl: { md: 1 } }}>
              <InputText
                dados={pesquisa}
                type='tel'
                tipo='date'
                field='termino'
                label='Término'
                setState={setPesquisa}
                erros={erros}
                mask='00/00/0000'
              />
            </Grid>

            <Grid item xs={12} sx={{ my: 3, textAlign: 'right' }}>

              <Button variant='contained' startIcon={<SearchIcon />} sx={{ py: 1 }} onClick={() => onDownload()}>Download</Button>
              <Button variant='contained' startIcon={<SearchIcon />} sx={{ py: 1, ml: 2 }} onClick={() => onPesquisar()}>Pesquisar</Button>

            </Grid>

          </Grid>
          <Grid item xs={12} >
            <RelatorioAtualizacaoDataTable
              acoes={[]}
              cabecalho={cabecalho}
              dados={dados}
            />
          </Grid>
        </Paper>
      </Container>

      <ExibirJSONDev oque={['pesquisa', pesquisa]} />

    </>
  )

}