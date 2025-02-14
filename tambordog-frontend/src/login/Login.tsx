import React, { useContext, useState } from "react"

import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
  Paper,
} from "@mui/material"

import InputFormat from "../components/InputFormat"
import ClsValidacao from "../utils/ClsValidacao"
import { useNavigate } from "react-router-dom"
import {
  ContextoGlobal,
  ContextoGlobalInterface,
} from "../globalstate/ContextoGlobal"
import ClsBackEnd from "../utils/ClsBackEnd"
import { RespostaPadraoInterface } from "../../../tambordog-backend/src/interfaces/padrao.interfaces"

import { LoginInterface } from '../../../tambordog-auth/src/interfaces/login.interfaces'
import { PermissoesTypes } from "../backendImports/types/PermissoesTypes"

export default function Login() {

  const clsBackEnd: ClsBackEnd = new ClsBackEnd()

  const [erros, setErros] = useState({})

  const [dados, setDados] = useState({
    cpf: "188.039.278-08",
    senha: "Teste",
  })

  const { setMensagemState, mensagemState } = useContext(
    ContextoGlobal
  ) as ContextoGlobalInterface

  const validarDados = (): boolean => {
    const clsValidacao: ClsValidacao = new ClsValidacao()

    let retorno: boolean = true

    let tmpErros: Record<string, string> = {}

    // Posso declarar o tmpErros da forma abaixo.... mesma declaração com Record<T,T>
    // let tmpErros: { [key: string]: string } = {}

    retorno = clsValidacao.eCPF("cpf", dados, tmpErros, retorno)

    retorno = clsValidacao.naoVazio("senha", dados, tmpErros, retorno)
    retorno = clsValidacao.tamanho(
      "senha",
      dados,
      tmpErros,
      retorno,
      false,
      3,
      10,
      "Campo deve ter entre 3 e 10 caracteres"
    )

    setErros(tmpErros)

    return retorno
  }

  const navegar = useNavigate()

  const { usuarioState, setUsuarioState } = useContext(
    ContextoGlobal
  ) as ContextoGlobalInterface

  const checarLoginSenha = () => {

    clsBackEnd.execute<RespostaPadraoInterface<LoginInterface>>({
      metodo: 'post',
      url: 'loginUsuario',
      dados: dados,
      setMensagemState: setMensagemState,
      mensagem: 'Verificando Usuário e Senha...'
    }).then(rs => {

      if (rs.ok && rs.dados) {

        setUsuarioState({ ...rs.dados, logado: true })

        setMensagemState({ ...mensagemState, exibir: false })

        if (rs.dados.perfil === 'A') {
          navegar('/admin')
        } else {
          navegar('/usuario')
        }

      } else {

        setUsuarioState({ logado: false, nome: '', perfil: 'U', permissoes: PermissoesTypes, token: '' })

        setMensagemState({
          botaoFechar: true,
          exibir: true,
          mensagem: rs.mensagem,
          tipo: "erro",
          titulo: "Erro no Login"
        })
      }
    })

  }

  const btEntrar = () => {
    if (validarDados()) {

      checarLoginSenha()

    }
  }

  return (
    <>
      <Grid
        container
        minHeight="100vh"
        justifyContent="center"
        alignContent="center"
      >
        <Grid item xs={12} sm={8} md={5} lg={4}>
          <Paper sx={{ padding: 3, margin: 3 }}>
            <Grid container>
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <img src="./imagens/logo.png" style={{ maxWidth: "100px" }} />
              </Grid>

              <Grid item xs={12} sx={{ mt: 3 }}>
                <InputFormat
                  label="CPF"
                  mask="000.000.000-00"
                  setState={setDados}
                  dados={dados}
                  field="cpf"
                  erros={erros}
                />
              </Grid>

              <Grid item xs={12} sx={{ mt: 3 }}>
                <InputFormat
                  field="senha"
                  type="password"
                  label="Senha"
                  dados={dados}
                  setState={setDados}
                  erros={erros}
                />
              </Grid>

              <Grid item xs={6} sx={{ mt: 3 }}>
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Lembrar-me"
                />
              </Grid>

              <Grid item xs={6} sx={{ textAlign: "right", mt: 4.5 }}>
                <Link>Esqueci a Senha</Link>
              </Grid>

              <Grid item xs={12} sx={{ mt: 3 }}>
                <Button
                  onClick={() => btEntrar()}
                  fullWidth
                  variant="contained"
                >
                  Entrar
                </Button>
              </Grid>

              <Grid item xs={12} sx={{ textAlign: "center", mt: 3 }}>
                <Link>Registrar-se</Link>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}
