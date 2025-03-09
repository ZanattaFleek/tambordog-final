import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import ErroAplicacao from '../Layout/ErroAplicacao'
import Layout from '../Layout/Layout'
import ExemploMenu from '../exemplo_apagar/menu'
import TesteBox from '../exemplo_apagar/TesteBox'
import Usuarios from '../View/Crud/Sistema/Usuarios'
import Grupos from '../View/Crud/Sistema/Grupos'
import Logout from '../View/Controller/Logout'
import AlterarSenha from '../View/Controller/AlterarSenha'
import Login from '../View/Controller/Login'
import AtualizarCadastroProdutor from '../View/Crud/AtualizacaoCadastro/AtualizarCadastroProdutor'
import RelatorioAtualizacao from '../View/Crud/AtualizacaoCadastro/RelatorioAtualizacao'
import Pedidos from '../View/Crud/Pedido/Pedidos'

export const router = createBrowserRouter( [
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErroAplicacao />,
    children: [
      {
        path: "AlterarSenha",
        element: <AlterarSenha />,
        errorElement: <ErroAplicacao />
      },
      {
        path: "RelatorioAtualizacao",
        element: <RelatorioAtualizacao />,
        errorElement: <ErroAplicacao />
      },
      {
        path: "Grupos",
        element: <Grupos />,
        errorElement: <ErroAplicacao />
      },
      {
        path: "Logout",
        element: <Logout />,
        errorElement: <ErroAplicacao />
      },
      {
        path: "Usuarios",
        element: <Usuarios />,
        errorElement: <ErroAplicacao />
      },
      {
        path: "AtualizarCadastroProdutor",
        element: <AtualizarCadastroProdutor />,
        errorElement: <ErroAplicacao />
      },
      {
        path: "Login",
        element: <Login />,
        errorElement: <ErroAplicacao />
      },
      {
        path: "login",
        element: <Login />,
        errorElement: <ErroAplicacao />
      },
      {
        path: "Pedidos",
        element: <Pedidos />,
        errorElement: <ErroAplicacao />
      },

      {
        path: "/TesteBox",
        element: <TesteBox />
      }

      // TODO - Criar Novo Crud
      
      /*


{
  path: "Parametros",
  element: <Parametros />,
  errorElement: <ErroAplicacao />
},
{
  path: "Perfis",
  element: <Perfis />,
  errorElement: <ErroAplicacao />
},
{
  path: "admin",
  element: <Login />,
  errorElement: <ErroAplicacao />
},
{
  path: "Admin",
  element: <Login />,
  errorElement: <ErroAplicacao />
},
{
  path: "/AlterarSenhaCliente/:token/:idCliente",
  element: <AlterarSenhaCliente />
}
*/
    ]
  },
  {
    path: "/ErroAplicacao",
    element: <ErroAplicacao />
  },
  {
    path: "/ExemploMenu",
    element: <ExemploMenu />
  }
] );