import React, { useContext, useEffect, useState } from 'react'
import { Container, FormLabel, Grid, IconButton, Paper, Typography } from '@mui/material'
import InputText from '../../../DevComponents/InputText'
import { ContextoGlobal, ContextoGlobalInterface } from '../../../GlobalStates/ContextoGlobal'
import Condicional from '../../../Layout/Condicional'
import Button from '@mui/material/Button'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'

import DataTable, { DataTableCabecalhoInterface } from '../../../DevComponents/DataTable'
import { useNavigate } from 'react-router-dom'
import ClsCrud from '../../../Utils/ClsCrud'

import { StatusForm } from '../../../Utils/ClsCrud'
import ClsValidacao from '../../../Utils/ClsValidacao'
import { AtualizacaoCadastroProdutorCulturaInterface, AtualizacaoCadastroProdutorPropriedadeInterface } from '../../../ImportBackend/Interfaces/AtualizacaoCadastroInterfaces'
import ExibirJSONDev from '../../../DevComponents/ExibirJSONDev'
import { ProdutorParaEditarPropriedadeInterface } from './AtualizarCadastroProdutor'
import DataTableCrudJSON from '../../../DevComponents/DataTableCrudJSON'
import AtualizacaoCadastroProdutorCulturaJSON from './AtualizacaoCadastroProdutorCulturaJSON'

interface PesquisaInterface {
  idProdutor: number
}

interface PropsInterface {
  rsProdutor: ProdutorParaEditarPropriedadeInterface
  onClosePropriedades: () => void
  permitirEdicao: boolean
}

export default function AtualizarCadastroProdutorPropriedade ( { rsProdutor, onClosePropriedades, permitirEdicao }: PropsInterface ) {

  const [statusForm, setStatusForm] = useState<StatusForm>( StatusForm.Pesquisando )

  const Cabecalho: Array<DataTableCabecalhoInterface> = [
    {
      campo: 'fazenda',
      cabecalho: 'Fazenda',
      alinhamento: 'left'
    },
    {
      campo: 'municipio',
      cabecalho: 'Município',
      alinhamento: 'left'
    },
    {
      campo: 'uf',
      cabecalho: 'UF',
      alinhamento: 'left'
    }
  ]

  const CabecalhoCultura: Array<DataTableCabecalhoInterface> = [
    {
      campo: 'safra',
      cabecalho: 'Safra',
      alinhamento: 'left'
    },
    {
      campo: 'cultura',
      cabecalho: 'Cultura',
      alinhamento: 'left'
    },
    {
      campo: 'materialPlantado',
      cabecalho: 'Material Plantado',
      alinhamento: 'left'
    },
    {
      campo: 'area',
      cabecalho: 'Área',
      alinhamento: 'left'
    },
  ]

  const ResetDados: AtualizacaoCadastroProdutorPropriedadeInterface =
  {
    idPropriedade: 0,
    idProdutor: rsProdutor.idProdutor,
    fazenda: '',
    municipio: '',
    uf: 'MG',
    areaFazenda: 0,
    areaIrrigada: 0,
    areaSequeiro: 0,
    culturas: [],
    leiteMes: 0,
    animaisCorteAno: 0,
  }

  const TituloForm = {
    [StatusForm.Incluindo]: 'Inclusão de Novo Cadastro de Propriedade',
    [StatusForm.Excluindo]: 'Exclusão de Cadastro de Propriedade Não Utilizada',
    [StatusForm.Pesquisando]: 'Cadastro de Propriedades são utilizados para Atualização de Cadastro do Sistema',
    [StatusForm.Editando]: 'Alteração de Dados de Propriedade',
    [StatusForm.Exibindo]: 'Dados de Propriedade'
  }

  const contexto = useContext( ContextoGlobal ) as ContextoGlobalInterface
  const { mensagemState, setMensagemState } = contexto

  const [dados, setDados] = useState<AtualizacaoCadastroProdutorPropriedadeInterface>( ResetDados )

  const [erros, setErros] = useState( {} )

  const [pesquisa] = useState<PesquisaInterface>( { idProdutor: rsProdutor.idProdutor } )

  const [rsPesquisa, setRsPesquisa] = useState<Array<AtualizacaoCadastroProdutorPropriedadeInterface>>( [] )

  const navigate = useNavigate()

  const validarDados = (): boolean => {

    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    let clsValidacao = new ClsValidacao()

    if ( dados.culturas.length === 0 ) {
      erros = { ...erros, culturas: 'Forneça ao menos uma cultura!' }
      retorno = false
    }

    retorno = clsValidacao.naoVazio( 'fazenda', dados, erros, retorno )
    retorno = clsValidacao.naoVazio( 'municipio', dados, erros, retorno )
    retorno = clsValidacao.eUF( 'uf', dados, erros, retorno )
    retorno = clsValidacao.naoVazio( 'areaFazenda', dados, erros, retorno )

    setErros( erros )

    return retorno

  }

  useEffect( () => {
    clsCrud.onClickPesquisa( pesquisa, mensagemState )
    //eslint-disable-next-line
  }, [rsProdutor.idProdutor] )

  const clsCrud: ClsCrud<AtualizacaoCadastroProdutorPropriedadeInterface> = new ClsCrud(
    navigate,
    ResetDados,
    setStatusForm,
    setDados,
    setErros,
    mensagemState,
    setMensagemState,
    setRsPesquisa,
    contexto,
    validarDados,
    {
      confirmarMutation: 'updateProdutorPropriedade',
      excluirMutation: 'delProdutorPropriedade',
      campoId: 'idPropriedade',
      camposPesquisa: '{idPropriedade fazenda municipio uf}',
      pesquisaQuery: 'getProdutorPropriedades',
      pesquisaPorId: 'getProdutorPropriedadePorId',
      camposPesquisaPorId: '{idPropriedade idProdutor fazenda municipio uf areaFazenda areaIrrigada areaSequeiro culturas { safra cultura area materialPlantado } leiteMes animaisCorteAno}'
    },
    {
      confirmando: 'Atualizando Propriedade',
      erroCadastro: 'Erro ao Cadastrar Propriedade',
      erroExclusao: 'Erro ao Excluir Propriedade',
      erroPesquisa: 'Erro ao Pesquisar Propriedade',
      pesquisando: 'Pesquisando Dados de Propriedades...',
      sucessoCadastro: 'Propriedade Cadastrada com sucesso!',
      atualizacaoSucesso: 'Propriedade Atualizada com sucesso!',
      tituloConfirmado: 'Confirmado!',
      sucessoExclusao: 'Propriedade Excluída com sucesso...',
      tituloConfirmacaoExclusao: 'Confirma?',
      tituloErroCadastro: 'Erro!',
      tituloErroExclusao: 'Erro!',
      tituloErroPesquisa: 'Erro!',
      excluindo: 'Excluindo Propriedade...'
    }
  )

  const ResetDadosCultura: AtualizacaoCadastroProdutorCulturaInterface = {
    area: 0,
    cultura: '',
    materialPlantado: '',
    safra: ''
  }

  const onChangeCultura = ( rsCulturas: Array<AtualizacaoCadastroProdutorCulturaInterface> ) => {
    setDados( { ...dados, culturas: rsCulturas } )
  }

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 5 }}>

        <Paper variant="outlined" sx={{ padding: 2 }}>
          <Grid container sx={{ display: 'flex', alignItems: 'stretch' }}>

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography component="h5" variant="h5" align="left">
                Cadastro de Propriedades
                <Typography variant="body2" gutterBottom>
                  {TituloForm[statusForm]}
                </Typography>
              </Typography>

              <IconButton onClick={() => onClosePropriedades()}>
                <CloseIcon />
              </IconButton>
            </Grid>


            <Grid item xs={12} sm={10} sx={{ mb: 3 }}>
              <InputText
                dados={rsProdutor}
                field='nome'
                label='Produtor'
                disabled={true}
                setState={() => { }}
              />

            </Grid>

            <Condicional condicao={statusForm === StatusForm.Pesquisando}>

              <Grid item xs={12} sm={2} alignSelf='center' sx={{ mt: { xs: 0, sm: 2 }, textAlign: { xs: 'right', sm: 'center' } }}>
                <Button variant='contained' disabled={!permitirEdicao} onClick={() => clsCrud.btIncluir()}>Incluir</Button>
              </Grid>

            </Condicional>

            <Condicional condicao={statusForm !== StatusForm.Pesquisando}>

              <Grid item xs={12}>

                <InputText
                  dados={dados}
                  field='fazenda'
                  label='Fazenda'
                  setState={setDados}
                  disabled={statusForm === StatusForm.Excluindo || !permitirEdicao}
                  erros={erros}
                  maxLength={50}
                  tipo='uppercase'
                />

              </Grid>

              <Grid item xs={9}>

                <InputText
                  dados={dados}
                  field='municipio'
                  label='Município'
                  setState={setDados}
                  disabled={statusForm === StatusForm.Excluindo || !permitirEdicao}
                  erros={erros}
                  maxLength={50}
                  tipo='uppercase'
                />

              </Grid>

              <Grid item xs={3} sx={{ pl: 1 }}>

                <InputText
                  dados={dados}
                  field='uf'
                  label='UF'
                  setState={setDados}
                  disabled={statusForm === StatusForm.Excluindo || !permitirEdicao}
                  erros={erros}
                  mask='uf'
                  tipo='uppercase'
                />

              </Grid>

              {/*

<Grid item xs={6}>

                <InputText
                dados={dados}
                field='areaCultivada'
                label='Área Cultivada (ha)'
                setState={setDados}
                disabled={statusForm === StatusForm.Excluindo || !permitirEdicao}
                erros={erros}
                  maxLength={50}
                  tipo='currency'
                  />
                  
                  </Grid>
*/}

              <Grid item xs={12} md={2}>

                <InputText
                  dados={dados}
                  field='areaFazenda'
                  label='Área Fazenda (ha)'
                  setState={setDados}
                  disabled={statusForm === StatusForm.Excluindo || !permitirEdicao}
                  erros={erros}
                  maxLength={50}
                  tipo='currency'
                />

              </Grid>

              <Grid item xs={12} md={2} sx={{ pl: { md: 1 } }}>

                <InputText
                  dados={dados}
                  field='areaIrrigada'
                  label='Área Irrigada (ha)'
                  setState={setDados}
                  disabled={statusForm === StatusForm.Excluindo || !permitirEdicao}
                  erros={erros}
                  maxLength={50}
                  tipo='currency'
                />

              </Grid>

              <Grid item xs={12} md={2} sx={{ pl: { md: 1 } }}>

                <InputText
                  dados={dados}
                  field='areaSequeiro'
                  label='Área Sequeiro (ha)'
                  setState={setDados}
                  disabled={statusForm === StatusForm.Excluindo || !permitirEdicao}
                  erros={erros}
                  maxLength={50}
                  tipo='currency'
                />

              </Grid>

              <Grid item xs={12} md={3} sx={{ pl: { md: 1 } }}>

                <InputText
                  dados={dados}
                  field='leiteMes'
                  label='Leite / Mês (L)'
                  setState={setDados}
                  disabled={statusForm === StatusForm.Excluindo || !permitirEdicao}
                  erros={erros}
                  tipo='currency'
                />

              </Grid>

              <Grid item xs={12} md={3} sx={{ pl: { md: 1 } }}>

                <InputText
                  dados={dados}
                  field='animaisCorteAno'
                  label='Q Animais Corte(Ano)'
                  setState={setDados}
                  disabled={statusForm === StatusForm.Excluindo || !permitirEdicao}
                  erros={erros}
                  tipo='currency'
                  scale={0}
                />

              </Grid>

              <Grid item xs={12}>
                <DataTableCrudJSON<AtualizacaoCadastroProdutorCulturaInterface>
                  dadosIniciaisRegistro={ResetDadosCultura}
                  cabecalho={CabecalhoCultura}
                  dados={dados.culturas}
                  ComponenteInputCrud={AtualizacaoCadastroProdutorCulturaJSON}
                  tituloCrud='Culturas / Plantio'
                  onChange={onChangeCultura}
                  acoes={permitirEdicao ? undefined : []}
                  disabled={!permitirEdicao}
                />
                <Condicional condicao={erros && typeof ( erros as any ).culturas === 'string'}>
                  <FormLabel sx={{ color: 'red' }}>Forneça no mínimo uma cultura!!</FormLabel>
                </Condicional>
              </Grid>

              {/*

              <Grid item xs={12}>

                <InputText
                  dados={dados}
                  field='parceirosComerciais'
                  label='Outros Parceiros Comerciais'
                  setState={setDados}
                  disabled={statusForm === StatusForm.Excluindo || !permitirEdicao}
                  erros={erros}
                  maxLength={255}
                />

              </Grid>

              <Grid item xs={12}>

                <InputText
                  dados={dados}
                  field='observacao'
                  label='Observação'
                  setState={setDados}
                  disabled={statusForm === StatusForm.Excluindo || !permitirEdicao}
                  erros={erros}
                  maxLength={255}
                />

              </Grid>

*/}

              <Grid item xs={12} sx={{ mt: 3 }}>

                <Condicional condicao={statusForm === StatusForm.Excluindo && permitirEdicao}>
                  <Button variant='contained' startIcon={<CheckIcon />} sx={{ my: 1, py: 1, mr: 2 }} onClick={() => clsCrud.btConfirmarExclusao( dados, mensagemState, pesquisa )}>Confirmar</Button>
                </Condicional>

                <Condicional condicao={statusForm !== StatusForm.Excluindo && permitirEdicao}>
                  <Button variant='contained' startIcon={<CheckIcon />} sx={{ my: 1, py: 1, mr: 2 }} onClick={() => clsCrud.btConfirmar( dados, mensagemState, statusForm, pesquisa )}>Confirmar</Button>
                </Condicional>

                <Button variant='contained' startIcon={<CloseIcon />} sx={{ py: 1 }} onClick={() => clsCrud.btCancelar()}>Cancelar</Button>

              </Grid>

            </Condicional>

            <Condicional condicao={statusForm === StatusForm.Pesquisando}>
              <Grid item xs={12} sx={{ mt: 3 }}>
                <DataTable dados={rsPesquisa} cabecalho={Cabecalho} acoes={[
                  { icone: 'delete', toolTip: 'Excluir', onAcionador: clsCrud.btExcluir },
                  { icone: 'create', toolTip: 'Alterar', onAcionador: clsCrud.btEditar }]} />
              </Grid>
            </Condicional>

            <ExibirJSONDev oque={['Dados: ', dados]} />

          </Grid>
        </Paper>

      </Container>
    </>
  )
}