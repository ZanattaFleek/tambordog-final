import React, { Context, useContext, useState } from "react"

import {
  BottomNavigation,
  BottomNavigationAction,
  Icon,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material"

import HomeIcon from "@mui/icons-material/Home"
import AddIcon from "@mui/icons-material/Add"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import PersonIcon from "@mui/icons-material/Person"
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed"
import SportsScoreIcon from "@mui/icons-material/SportsScore"
// import CrudCao from "../crud/CrudCao"

import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"

import { useNavigate } from "react-router-dom"
import Condicional from "../../components/Condicional"
import { ContextoGlobal, ContextoGlobalInterface } from "../../globalstate/ContextoGlobal"

interface menuSettingsInterface {
  id: number
  menu: string
  icon: string
  path: string
  permitido: boolean
}

export default function MenuInferior() {
  const [value, setValue] = React.useState(0)

  const { usuarioState } = useContext(
      ContextoGlobal
    ) as ContextoGlobalInterface

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  )

  const navigate = useNavigate()

  const irPara = (url: string) => {
    setAnchorElUser(null)
    navigate(url)
  }

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    // console.log("oi....")
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const menuSettings: Array<menuSettingsInterface> = [
    {
      id: 1,
      menu: "Atleta",
      icon: "person_outline_outlined",
      path: "/admin/CrudAtleta",
      permitido: usuarioState.permissoes.ATLETA.PERMISSOES.MANUTENCAO.length > 0
    },
    {
      id: 2,
      menu: "Raça",
      icon: "pets",
      path: "/admin/CrudRaca",
      permitido: false
    },
    {
      id: 3,
      menu: "Categoria",
      icon: "military_tech",
      path: "/admin/CrudCategoria",
      permitido: false
    },
    {
      id: 4,
      menu: "Campeonato",
      icon: "emoji_events",
      path: "/admin/CrudCampeonato",
      permitido: false
    },
    {
      id: 5,
      menu: "Prova",
      icon: "sports_score",
      path: "/admin/CrudProva",
      permitido: false
    },
  ]

  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={(_event, newValue) => {
          setValue(newValue)
        }}
      >
        <BottomNavigationAction
          label="Home"
          icon={<HomeIcon />}
          onClick={() => irPara("/admin")}
        />

        {/*
        
        <BottomNavigationAction
          label="Atletas"
          icon={<PersonIcon />}
          onClick={() => irPara("/CrudAtleta")}
        />

        <BottomNavigationAction
          label="Raça"
          icon={<PetsIcon />}
          onClick={() => irPara("/CrudRaca")}
        />

        <BottomNavigationAction
          label="Categoria"
          icon={<DynamicFeedIcon />}
          onClick={() => irPara("/CrudCategoria")}
        />

        <BottomNavigationAction
          label="Campeonato"
          icon={<EmojiEventsIcon />}
          onClick={() => irPara("/CrudCampeonato")}
        />

        <BottomNavigationAction
          label="Prova"
          icon={<SportsScoreIcon />}
          onClick={() => irPara("/CrudProva")}
        />

        */}

        <BottomNavigationAction
          label="Cadastros"
          icon={<AddIcon />}
          onClick={(ev) => handleOpenUserMenu(ev)}
        />
      </BottomNavigation>
      <Menu
        sx={{ mt: "-55px", ml: "25px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {menuSettings.map((menu) => (
          <Condicional condicao={menu.permitido} key={menu.id}>
            <MenuItem key={menu.id} onClick={() => irPara(menu.path)}>
              <Icon sx={{ textAlign: "center", marginRight: 1 }}>
                {menu.icon}
              </Icon>
              <Typography textAlign="center">{menu.menu}</Typography>
            </MenuItem>
          </Condicional>
        ))}
      </Menu>
    </Paper>
  )
}
