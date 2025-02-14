import { LessThan } from "typeorm";
import Usuario from "../entity/sistema/Usuario";
import UsuarioSessao from "../entity/sistema/UsuarioSessao";

import { v4 as uuidv4 } from 'uuid';
import { RespostaPadraoInterface } from "../interfaces/padrao.interfaces";
import { AppDataSource } from "../entity/dataSource";
import { PermissoesTypes, PermissoesTypesInterface } from "../types/PermissoesTypes";
import { LoginInterface } from "../interfaces/login.interfaces";

interface rsSqlPermissaoPorUsuario {
    modulo: string
    permissao: string
}

const SQL_PERMISSAO_POR_USUARIO = `
    SELECT m.modulo, mp.permissao FROM modulospermissoes AS mp 

    INNER JOIN modulos AS m
    ON mp.idModulo = m.idModulo

    INNER JOIN 
    (
    SELECT grpe.idModuloPermissao FROM gruposusuarios AS grus
    INNER JOIN grupospermissoes AS grpe
    ON grus.idGrupo = grpe.idGrupo
    WHERE grus.idUsuario = ?
    UNION ALL
    SELECT uspe.idModuloPermissao FROM usuariospermissoes AS uspe
    WHERE uspe.idUsuario = ?
    ) AS permissoes
    ON mp.idModuloPermissao = permissoes.idModuloPermissao
`

export default class ClsLoginUsuarioController {

    public logar(cpf: string, senha: string): Promise<RespostaPadraoInterface<LoginInterface>> {

        let retorno: RespostaPadraoInterface<LoginInterface> = {
            ok: false,
            mensagem: 'Erro no Login',
            dados: {
                perfil: 'U',
                permissoes: PermissoesTypes,
                token: '',
                nome: ''
            }
        }

        return this.fecharSessoesEmAberto(cpf).then((rsUsuarioExistente) => {
            if (rsUsuarioExistente) {

                return AppDataSource.getRepository(Usuario).findOne({ where: { cpf: cpf, senha: senha, tentativasLogin: LessThan(4) } }).then((rsUsuarioLogado) => {

                    if (rsUsuarioLogado) {

                        const token: string = uuidv4()

                        return AppDataSource.getRepository(Usuario).update({ idUsuario: rsUsuarioLogado.idUsuario }, { tentativasLogin: 0 }).then(() => {

                            return AppDataSource.getRepository(UsuarioSessao).save({
                                idUsuario: rsUsuarioLogado.idUsuario,
                                ativo: true,
                                token: token,
                            }).then(() => {
                                // return AppDataSource.destroy().then(() => {

                                return this.permissoesUsuario(rsUsuarioLogado.idUsuario).then((rsPermissoes) => {
                                    return {
                                        ok: true,
                                        mensagem: 'Login Realizado',
                                        dados: {
                                            perfil: rsUsuarioLogado.perfil,
                                            permissoes: rsPermissoes,
                                            token: token,
                                            nome: rsUsuarioLogado.nome.split(' ')[0]
                                        }
                                    }
                                })
                                // })
                            })

                        })

                    } else {

                        return AppDataSource.getRepository(Usuario).update({ cpf: cpf }, { tentativasLogin: () => "tentativasLogin + 1" }).then(() => {
                            return retorno
                        })

                    }

                })

            } else {
                return retorno
            }
        })

    }

    private fecharSessoesEmAberto(cpf: string): Promise<boolean> {

        return AppDataSource.getRepository(Usuario).findOne({ where: { cpf: cpf } }).then((rsUsuarioExistente) => {

            if (rsUsuarioExistente) {

                return AppDataSource.getRepository(UsuarioSessao).update({ idUsuario: rsUsuarioExistente.idUsuario }, { ativo: false }).then(() => {
                    return true
                })

            } else {

                return false

            }

        })
    }

    private permissoesUsuario(idUsuario: string): Promise<PermissoesTypesInterface> {

        return AppDataSource.query<Array<rsSqlPermissaoPorUsuario>>(SQL_PERMISSAO_POR_USUARIO, [idUsuario, idUsuario]).then((rsPermissoes) => {

            let retorno = JSON.parse(JSON.stringify(PermissoesTypes))

            Object.keys(PermissoesTypes).forEach((keyModulo) => {

                const modulo = PermissoesTypes[keyModulo].MODULO;

                Object.keys(PermissoesTypes[keyModulo].PERMISSOES).forEach((keyPermissao) => {

                    const permissao = PermissoesTypes[keyModulo].PERMISSOES[keyPermissao];

                    console.log(modulo, permissao);

                    if (rsPermissoes.findIndex((rs) => rs.modulo === modulo && rs.permissao === permissao) < 0) {
                        retorno[keyModulo].PERMISSOES[keyPermissao] = ''
                    }

                })

            })

            // console.log(rsPermissoes)
            return retorno
        })

    }

}