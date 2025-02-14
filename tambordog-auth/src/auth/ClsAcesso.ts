import GrupoPermissao from "src/entity/sistema/GrupoPermissao";
import { AppDataSource } from "../entity/dataSource";
import Modulo from "../entity/sistema/Modulo";
import ModuloPermissao from "../entity/sistema/ModuloPermissao";

const SQL_PERMISSAO: string = `
    SELECT grpe.idModuloPermissao FROM gruposusuarios AS grus
    INNER JOIN grupospermissoes AS grpe
    ON grus.idGrupo = grpe.idGrupo
    WHERE grus.idUsuario = ? AND grpe.idModuloPermissao = ?
    UNION ALL
    SELECT uspe.idModuloPermissao FROM usuariospermissoes AS uspe
    WHERE uspe.idUsuario = ? AND uspe.idModuloPermissao = ?;
`

export default class ClsAcesso {
   public checarAcesso(idUsuario: string, modulo: string, permissao: string): Promise<boolean> {

      if (idUsuario && idUsuario.length > 0) {

         return this.pesquisarIdModuloPermissao(modulo, permissao).then(idModuloPermissao => {

            return AppDataSource.query(SQL_PERMISSAO, [idUsuario, idModuloPermissao, idUsuario, idModuloPermissao]).then(rsPermissao => {

               if (rsPermissao && rsPermissao.length > 0) {
                  return true
               } else {
                  return false
               }

            })

         })

      } else {

         return Promise.resolve(false)

      }

   }

   private pesquisarIdModuloPermissao(modulo: string, permissao: string): Promise<string> {

      return this.pesquisarIdModulo(modulo).then(idModulo => {

         return AppDataSource.getRepository(ModuloPermissao).findOne({ where: { idModulo: idModulo, permissao: permissao } }).then(rsModuloPermissao => {
            if (rsModuloPermissao && rsModuloPermissao.idModuloPermissao) {
               return rsModuloPermissao.idModuloPermissao
            } else {
               return AppDataSource.getRepository(ModuloPermissao).save({ idModulo: idModulo, permissao: permissao }).then(rsModuloPermissao => {

                  if (process.env.UUID_GRUPO_ADMINISTRADOR) {

                     return AppDataSource.getRepository(GrupoPermissao).save({
                        idGrupo: process.env.UUID_GRUPO_ADMINISTRADOR,
                        idModuloPermissao: rsModuloPermissao.idModuloPermissao,
                     }).then(() => {
                        return rsModuloPermissao.idModuloPermissao
                     })

                  } else {

                     return rsModuloPermissao.idModuloPermissao

                  }

               })
            }
         })

      })

   }

   private pesquisarIdModulo(modulo: string): Promise<string> {
      return AppDataSource.getRepository(Modulo).findOne({ where: { modulo: modulo } }).then(rsModulo => {
         // console.log('Retorno pesquisarIdModulo: ',rsModulo)
         if (rsModulo && rsModulo.idModulo) {
            return rsModulo.idModulo
         } else {
            return AppDataSource.getRepository(Modulo).save({ modulo: modulo }).then(rsModulo => {
               return rsModulo.idModulo
            })
         }
      })
   }

}