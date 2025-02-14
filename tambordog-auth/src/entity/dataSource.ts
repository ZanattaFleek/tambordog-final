import { DataSource } from "typeorm";
import Usuario from "./sistema/Usuario";
import UsuarioSessao from "./sistema/UsuarioSessao";
import Grupo from "./sistema/Grupo";
import GrupoUsuario from "./sistema/GrupoUsuario";
import GrupoPermissao from "./sistema/GrupoPermissao";
import UsuarioPermissao from "./sistema/UsuarioPermissao";
import Modulo from "./sistema/Modulo";
import ModuloPermissao from "./sistema/ModuloPermissao";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "66.94.105.135",
  port: 3306,
  username: "fsd0043",
  password: "FleekPass@2023a",
  database: "producao_tambordog",
  synchronize: true,
  logging: false,
  entities: [
    Grupo,
    GrupoUsuario,
    GrupoPermissao,
    Usuario,
    UsuarioPermissao,
    UsuarioSessao,
    Modulo,
    ModuloPermissao
  ],
  subscribers: [],
  migrations: [],
});
