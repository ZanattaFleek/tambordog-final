import React, { useContext, useState } from 'react'
import { Container, Grid, IconButton, Paper, Typography } from '@mui/material'
import InputText from '../../../DevComponents/InputText'
import { ContextoGlobal, ContextoGlobalInterface } from '../../../GlobalStates/ContextoGlobal'
import Condicional from '../../../Layout/Condicional'
import Button from '@mui/material/Button'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'

import DataTable, { DataTableCabecalhoInterface } from '../../../DevComponents/DataTable'
import { useNavigate } from 'react-router-dom'
import ClsCrud, { StatusForm } from '../../../Utils/ClsCrud'

import ClsValidacao from '../../../Utils/ClsValidacao'
import { AtualizacaoCadastroProdutorInterface, rsPesquisaProdutorRespostaInterface } from '../../../ImportBackend/Interfaces/AtualizacaoCadastroInterfaces'
import RadioButton from '../../../DevComponents/RadioButton'
import { TipoClienteType, TipoClienteTypes } from '../../../ImportBackend/types/ConstantesDataTypes'
import BackEndAPI from '../../../Services/BackEndAPI'
import ExibirJSONDev from '../../../DevComponents/ExibirJSONDev'
import AtualizarCadastroProdutorPropriedade from './AtualizarCadastroProdutorPropriedade'
import ClsAcesso from '../../../Utils/ClsAcesso'
import { SISTEMA_PERMISSOES } from '../../../ImportBackend/types/AcessosDataTypes'
import PesquisarTabela from '../../../DevComponents/PesquisarTabela'
import { UsuarioInterface } from '../../../ImportBackend/Interfaces/UsuarioInterfaces'

interface PesquisaInterface {
  descricao: string
}

export interface ProdutorParaEditarPropriedadeInterface {
  idProdutor: number
  nome: string
}

export default function AtualizarCadastroProdutor () {

  const [statusForm, setStatusForm] = useState<StatusForm>( StatusForm.Pesquisando )

  const [editarPropriedade, setEditarPropriedade] = useState<ProdutorParaEditarPropriedadeInterface>( { idProdutor: -1, nome: '' } )

  const Cabecalho: Array<DataTableCabecalhoInterface> = [
    {
      campo: 'nome',
      cabecalho: 'Nome',
      alinhamento: 'left'
    },
    {
      campo: 'cpfCnpj',
      cabecalho: 'CPF',
      alinhamento: 'left'
    },
    {
      campo: 'fone',
      cabecalho: 'Fone',
      alinhamento: 'left'
    },
    {
      campo: 'associado',
      cabecalho: 'Associado',
      alinhamento: 'left',
      format: ( v ) => v ? 'Sim' : 'Não'
    },
    {
      campo: 'codigocliente',
      cabecalho: 'Código Cliente',
      alinhamento: 'left'
    },
    {
      campo: 'Usuario',
      cabecalho: 'Responsável',
      alinhamento: 'left',
      format: ( v: UsuarioInterface ) => v.nome
    },
  ]

  const contexto = useContext( ContextoGlobal ) as ContextoGlobalInterface

  const ResetDados: AtualizacaoCadastroProdutorInterface =
  {
    idProdutor: 0,
    tipo: TipoClienteType.PF,
    nome: '',
    cpfCnpj: '',
    associado: false,
    codigocliente: '',
    email: '',
    fone: '',
    parceirosComerciais: '',
    observacao: '',
    idUsuario: contexto.loginState.idUsuario,
    cadastradoERP: false
  }

  const TituloForm = {
    [StatusForm.Incluindo]: 'Inclusão de Novo Cadastro de Produtor',
    [StatusForm.Excluindo]: 'Exclusão de Cadastro de Produtor Não Utilizado',
    [StatusForm.Pesquisando]: 'Cadastro de Produtores são utilizados para Atualização de Cadastro do Sistema',
    [StatusForm.Editando]: 'Alteração de Dados de Produtor',
    [StatusForm.Exibindo]: 'Dados do Produtor'
  }

  const { mensagemState, setMensagemState } = contexto

  const [dados, setDados] = useState<AtualizacaoCadastroProdutorInterface>( ResetDados )

  const [erros, setErros] = useState( {} )

  const [pesquisa, setPesquisa] = useState<PesquisaInterface>( { descricao: '' } )

  const [rsPesquisa, setRsPesquisa] = useState<Array<AtualizacaoCadastroProdutorInterface>>( [] )

  const [cpfCnpjJaCadastrado, setCpfCnpjJaCadastrado] = useState<boolean>( false )

  const clsApi = new BackEndAPI()

  const navigate = useNavigate()

  const [permiteEditar, setPermiteEditar] = useState<boolean>( false )
  const clsAcesso: ClsAcesso = new ClsAcesso()

  const validarDados = (): boolean => {

    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    let clsValidacao = new ClsValidacao()

    if ( dados.tipo === TipoClienteType.PF ) {
      retorno = clsValidacao.eCPF( 'cpfCnpj', dados, erros, retorno, true )
    } else {
      retorno = clsValidacao.eCNPJ( 'cpfCnpj', dados, erros, retorno, true )
    }

    if ( retorno ) {
      if ( cpfCnpjJaCadastrado ) {
        retorno = false
        erros = { ...erros, cpfCnpj: 'Produtor Já Cadastrado no APP!' }
      }
    }

    retorno = clsValidacao.naoVazio( 'nome', dados, erros, retorno )
    retorno = clsValidacao.eTelefone( 'fone', dados, erros, retorno )

    setErros( erros )

    return retorno

  }

  const clsCrud: ClsCrud<AtualizacaoCadastroProdutorInterface> = new ClsCrud(
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
      confirmarMutation: 'updateProdutor',
      excluirMutation: 'delProdutor',
      campoId: 'idProdutor',
      camposPesquisa: '{idProdutor nome fone tipo cpfCnpj associado codigocliente idUsuario Usuario { nome }}',
      pesquisaQuery: 'getProdutores',
      pesquisaPorId: 'getProdutorPorId',
      camposPesquisaPorId: '{idProdutor tipo nome cpfCnpj associado codigocliente email fone parceirosComerciais observacao idUsuario cadastradoERP}'
    },
    {
      confirmando: 'Atualizando Produtor',
      erroCadastro: 'Erro ao Cadastrar Produtor',
      erroExclusao: 'Erro ao Excluir Produtor',
      erroPesquisa: 'Erro ao Pesquisar Produtor',
      pesquisando: 'Pesquisando Dados de Produtores...',
      sucessoCadastro: 'Produtor Cadastrado com sucesso!',
      atualizacaoSucesso: 'Produtor Atualizado com sucesso!',
      tituloConfirmado: 'Confirmado!',
      sucessoExclusao: 'Produtor Excluído com sucesso...',
      tituloConfirmacaoExclusao: 'Confirma?',
      tituloErroCadastro: 'Erro!',
      tituloErroExclusao: 'Erro!',
      tituloErroPesquisa: 'Erro!',
      excluindo: 'Excluindo Produtor...'
    }
  )

  const onKeyPesquisa = () => {
    clsCrud.onClickPesquisa( pesquisa.descricao, mensagemState )
  }

  const pesquisarCpfCnpj = ( valor: string ) => {

    const clsValidacao: ClsValidacao = new ClsValidacao()

    if ( valor.length > 0 && (
      ( dados.tipo === TipoClienteType.PF && valor.length === 14 ) || ( dados.tipo === TipoClienteType.PJ && valor.length === 18 )
    ) ) {

      // Se for CNPJ ou CPF e for validado, prossegue....
      if ( clsValidacao.eCPF( 'cpf', { cpf: valor }, {}, true ) || clsValidacao.eCNPJ( 'cnpj', { cnpj: valor }, {}, true ) ) {

        const query: string = `
          consutarClientePorCpfCnpj(cpfCnpj: "${valor}") {
            cadastradoERP
            cadastradoAPP
            nome
            cpfCnpj
            codigocliente
            associado
          }
        `

        clsApi.query<rsPesquisaProdutorRespostaInterface>( query, 'consutarClientePorCpfCnpj', 'Pesquisando documento...', contexto ).then( rs => {

          if ( rs.cadastradoAPP ) {
            setCpfCnpjJaCadastrado( true )
            setErros( { ...erros, cpfCnpj: 'Produtor Já Cadastrado no APP!' } )
            setDados( { ...dados, cpfCnpj: valor, cadastradoERP: rs.cadastradoERP } )
          } else {
            if ( rs.cadastradoERP ) {

              setDados( { ...dados, nome: rs.nome, cpfCnpj: valor, associado: rs.associado, codigocliente: rs.codigocliente, cadastradoERP: rs.cadastradoERP } )

            } else {
              setErros( { ...erros, cpfCnpj: 'CNPJ / CPF Não Cadastrado no ERP Nem no APP' } )
              setDados( { ...dados, cpfCnpj: valor, associado: false, codigocliente: '', cadastradoERP: rs.cadastradoERP } )
              setCpfCnpjJaCadastrado( false )
            }
          }

        } ).catch( () => {
          setErros( { cpfCnpj: 'Não Foi Possível Consultar CNPJ / CPF!' } )
        } )

      } else {

        setErros( { cpfCnpj: 'Forneça um CPF ou CNPJ Válido!' } )

      }

    } else {
      setDados( { ...dados, cpfCnpj: valor, associado: false, codigocliente: '', cadastradoERP: false } )
      setErros( { ...erros, cpfCnpj: '' } )
    }

  }

  const chkAcessoEditarDadosOutrosUsuarios = (): boolean => {

    const acesso: boolean = clsAcesso.chkAcesso(
      contexto.loginState.permissoes,
      SISTEMA_PERMISSOES.ATUALIZACAOCADASTRO.MODULO,
      SISTEMA_PERMISSOES.ATUALIZACAOCADASTRO.PERMISSOES.ACESSO_OUTROS_USUARIOS )

    return acesso

  }

  const btExibirPropriedades = ( rs: Partial<AtualizacaoCadastroProdutorInterface> ) => {
    setPermiteEditar( rs.idUsuario === contexto.loginState.idUsuario || chkAcessoEditarDadosOutrosUsuarios() )
    setEditarPropriedade( { idProdutor: rs.idProdutor as number, nome: rs.nome as string } )
  }

  const onClosePropriedades = () => {
    setEditarPropriedade( { idProdutor: -1, nome: '' } )
  }

  return (
    <>
      <Condicional condicao={editarPropriedade.idProdutor < 0}>
        <Container maxWidth="md" sx={{ mt: 5 }}>

          <Paper variant="outlined" sx={{ padding: 2 }}>
            <Grid container sx={{ display: 'flex', alignItems: 'stretch' }}>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography component="h5" variant="h5" align="left">
                  Cadastro de Produtores
                  <Typography variant="body2" gutterBottom>
                    {TituloForm[statusForm]}
                  </Typography>
                </Typography>

                <IconButton onClick={() => clsCrud.btFechar()}>
                  <CloseIcon />
                </IconButton>
              </Grid>

              <Condicional condicao={statusForm === StatusForm.Pesquisando}>

                <Grid item xs={12} sm={10} sx={{ mb: 3 }}>

                  <InputText
                    dados={pesquisa}
                    field='descricao'
                    label='Pesquisar'
                    setState={setPesquisa}
                    iconeEnd="search"
                    onClickIconeEnd={() => clsCrud.onClickPesquisa( pesquisa.descricao, mensagemState )}
                    mapKeyPress={[{ key: 'Enter', onKey: onKeyPesquisa }]}
                  />

                </Grid>

                <Grid item xs={12} sm={2} alignSelf='center' sx={{ mt: { xs: 0, sm: 2 }, textAlign: { xs: 'right', sm: 'center' } }}>
                  <Button variant='contained' onClick={() => clsCrud.btIncluir()}>Incluir</Button>
                </Grid>

              </Condicional>

              <Condicional condicao={statusForm !== StatusForm.Pesquisando}>

                <Grid item xs={12} md={6}>
                  <RadioButton
                    campoID='idTipoCliente'
                    campoDescricao='descricao'
                    opcoes={TipoClienteTypes}
                    dados={dados}
                    field='tipo'
                    setState={setDados}
                    label='Tipo do Cliente'
                    disabled={statusForm !== StatusForm.Incluindo}
                    row
                  />

                </Grid>

                <Grid item xs={12} md={6} sx={{ pl: { md: 1 } }}>

                  <InputText
                    dados={dados}
                    field='cpfCnpj'
                    label={dados.tipo === TipoClienteType.PJ ? 'CNPJ' : 'CPF'}
                    setState={setDados}
                    disabled={statusForm !== StatusForm.Incluindo}
                    erros={erros}
                    maxLength={dados.tipo === TipoClienteType.PJ ? 18 : 14}
                    mask={dados.tipo === TipoClienteType.PJ ? 'cnpj' : 'cpf'}
                    onChange={( v: string ) => pesquisarCpfCnpj( v )}
                  />

                </Grid>


                <Grid item xs={12}>

                  <InputText
                    dados={dados}
                    field='nome'
                    label='Nome'
                    setState={setDados}
                    disabled={statusForm === StatusForm.Excluindo || dados.cadastradoERP || ( dados.idUsuario !== contexto.loginState.idUsuario && !chkAcessoEditarDadosOutrosUsuarios() )}
                    erros={erros}
                    maxLength={50}
                    tipo='uppercase'
                  />

                </Grid>

                <Grid item xs={12}>

                  <InputText
                    dados={dados}
                    field='email'
                    label='Email'
                    setState={setDados}
                    disabled={statusForm === StatusForm.Excluindo || ( dados.idUsuario !== contexto.loginState.idUsuario && !chkAcessoEditarDadosOutrosUsuarios() )}
                    erros={erros}
                    maxLength={255}
                    tipo='uppercase'
                  />

                </Grid>

                <Grid item xs={12}>
                  <InputText
                    dados={dados}
                    field='fone'
                    label='Fone / WhatsAPP'
                    setState={setDados}
                    erros={erros}
                    mask='tel'
                    disabled={statusForm === StatusForm.Excluindo || ( dados.idUsuario !== contexto.loginState.idUsuario && !chkAcessoEditarDadosOutrosUsuarios() )}
                  />
                </Grid>

                <Grid item xs={12}>

                  <InputText
                    dados={dados}
                    field='parceirosComerciais'
                    label='Outros Parceiros Comerciais'
                    setState={setDados}
                    disabled={statusForm === StatusForm.Excluindo || ( dados.idUsuario !== contexto.loginState.idUsuario && !chkAcessoEditarDadosOutrosUsuarios() )}
                    erros={erros}
                    maxLength={255}
                    tipo='uppercase'
                  />

                </Grid>

                <Grid item xs={12}>

                  <InputText
                    dados={dados}
                    field='observacao'
                    label='Observação'
                    setState={setDados}
                    disabled={statusForm === StatusForm.Excluindo || ( dados.idUsuario !== contexto.loginState.idUsuario && !chkAcessoEditarDadosOutrosUsuarios() )}
                    erros={erros}
                    maxLength={255}
                    tipo='uppercase'
                  />

                </Grid>

                <Grid item xs={6} sx={{ mt: 3 }}>

                  <InputText
                    dados={dados}
                    field='associado'
                    label='Associado'
                    tipo='checkbox'
                    setState={setDados}
                    disabled={true}
                    erros={erros}
                  />

                </Grid>


                <Grid item xs={6} sx={{ pl: 1 }}>

                  <InputText
                    dados={dados}
                    field='codigocliente'
                    label='Código Cliente ERP'
                    setState={setDados}
                    erros={erros}
                    disabled={true}
                  />

                </Grid>

                <Grid item xs={12}>

                  <PesquisarTabela<UsuarioInterface>
                    setState={setDados}
                    field='idUsuario'
                    fieldSet='idUsuario'
                    label='Usuário Responsável'
                    dados={dados}
                    campoQueryPesquisaID='idUsuario'
                    campoQueryPesquisa='pesquisa'
                    camposRetornoQueryPesquisa='{idUsuario, nome}'
                    campoLabelQueryPesquisa='nome'
                    nomeQueryPesquisa='getUsuarios'
                    nomeQueryPesquisaID='getUsuarioPorId'
                    mensagemPesquisa='Procurando Usuários...'
                    disabled={statusForm === StatusForm.Excluindo || !chkAcessoEditarDadosOutrosUsuarios()}
                    erros={erros}
                  />

                </Grid>

                <Grid item xs={12} sx={{ mt: 3 }}>

                  <Condicional condicao={statusForm === StatusForm.Excluindo && ( dados.idUsuario === contexto.loginState.idUsuario || chkAcessoEditarDadosOutrosUsuarios() )}>
                    <Button variant='contained' startIcon={<CheckIcon />} sx={{ my: 1, py: 1, mr: 2 }} onClick={() => clsCrud.btConfirmarExclusao( dados, mensagemState, pesquisa.descricao )}>Confirmar</Button>
                  </Condicional>

                  <Condicional condicao={statusForm === StatusForm.Incluindo || ( statusForm === StatusForm.Editando && ( dados.idUsuario === contexto.loginState.idUsuario || chkAcessoEditarDadosOutrosUsuarios() ) )}>
                    <Button variant='contained' startIcon={<CheckIcon />} sx={{ my: 1, py: 1, mr: 2 }} onClick={() => clsCrud.btConfirmar( dados, mensagemState, statusForm, pesquisa.descricao )}>Confirmar</Button>
                  </Condicional>

                  <Button variant='contained' startIcon={<CloseIcon />} sx={{ py: 1 }} onClick={() => clsCrud.btCancelar()}>Cancelar</Button>

                </Grid>

              </Condicional>

              <Condicional condicao={statusForm === StatusForm.Pesquisando}>
                <Grid item xs={12} sx={{ mt: 3 }}>
                  <DataTable dados={rsPesquisa} cabecalho={Cabecalho} acoes={
                    [
                      { icone: 'delete', toolTip: 'Excluir', onAcionador: clsCrud.btExcluir, onDisabled: () => !chkAcessoEditarDadosOutrosUsuarios() },
                      { icone: 'create', toolTip: 'Alterar', onAcionador: clsCrud.btEditar },
                      { icone: 'landscape', toolTip: 'Fazendas', onAcionador: ( rs ) => btExibirPropriedades( rs ) },
                    ]
                  } />
                </Grid>
              </Condicional>


            </Grid>
          </Paper>

        </Container>
      </Condicional>

      <Condicional condicao={editarPropriedade.idProdutor >= 0}>
        <AtualizarCadastroProdutorPropriedade
          rsProdutor={editarPropriedade}
          onClosePropriedades={() => onClosePropriedades()}
          permitirEdicao={permiteEditar}
        />
      </Condicional>


      <ExibirJSONDev oque={[
        'contexto.loginState.permissoes', contexto.loginState.permissoes,
        'rsPesquisa: ', rsPesquisa,
        'Dados: ', dados,
        'contexto.loginState.idUsuario', contexto.loginState.idUsuario,
        // 'StatusForm.Editando', StatusForm.Editando,
        // 'StatusForm.Incluindo', StatusForm.Incluindo,
        // 'statusForm', statusForm,
        'dados.idUsuario', dados.idUsuario

      ]} />

    </>
  )
}