import React, { useEffect, useState } from "react"
import { ThemeProvider } from "@mui/material"
import {
  ContextoGlobal,
  ContextoGlobalInterface,
} from "./globalstate/ContextoGlobal"
import { useUsuarioState } from "./globalstate/UsuarioState"
import { useLayoutState } from "./globalstate/LayoutState"
import { Outlet } from "react-router-dom"
import Condicional from "./components/Condicional"
import MenuInferior from "./admin/layout/MenuInferior"
import { ROTAS_LIVRES } from "./admin/layout/ClsMenu"
import EventosEmAberto from "./eventos/EventosEmAberto"
import TopBar from "./admin/layout/TopBar"
import { THEME } from "./config/Theme"
import { styled } from "@mui/material/styles"
import { useMensagemState } from "./globalstate/MensagemState"
import Mensagem from "./components/Mensagem"
import Login from "./login/Login"

export default function AppAdmin() {
  const chkRotaLivre = () => {
    const urlAtual: string = window.location.href

    const indice: number = ROTAS_LIVRES.findIndex((rsRota) => {
      return urlAtual.includes(rsRota)
    })

    setRotaLivre(indice >= 0)
  }

  const { usuarioState, setUsuarioState } = useUsuarioState()

  const { mensagemState, setMensagemState } = useMensagemState()

  const { layoutState, setLayoutState } = useLayoutState()

  const [rotaLivre, setRotaLivre] = useState<boolean>(false)

  const ContextoGlobalDefault: ContextoGlobalInterface = {
    setUsuarioState: setUsuarioState,
    usuarioState: usuarioState,
    layoutState: layoutState,
    setLayoutState: setLayoutState,
    mensagemState: mensagemState,
    setMensagemState: setMensagemState,
  }

  useEffect(() => {
    chkRotaLivre()
  })

  const Offset = styled("div")(({ theme }) => theme.mixins.toolbar)

  return (
    <>
      <ThemeProvider theme={THEME}>
        <ContextoGlobal.Provider value={ContextoGlobalDefault}>
          <Mensagem />

          <Condicional condicao={usuarioState.logado}>
            <TopBar />
            <Offset />
          </Condicional>

          <Condicional
            condicao={
              (!usuarioState.logado && rotaLivre) || usuarioState.logado
            }
          >
            <Outlet />
            <Offset />
          </Condicional>

          <Condicional
            condicao={
              (!usuarioState.logado && !rotaLivre)
            }
          >
            <Login />
            <Offset />
          </Condicional>

          <Condicional condicao={usuarioState.logado}>
            <MenuInferior />
          </Condicional>

        </ContextoGlobal.Provider>
      </ThemeProvider>
    </>
  )
}


