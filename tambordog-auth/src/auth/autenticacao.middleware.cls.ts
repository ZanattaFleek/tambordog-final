import { AppDataSource } from "src/entity/dataSource";
import UsuarioSessao from "src/entity/sistema/UsuarioSessao";

export default class ClsAutenticacaoMiddleware {
    public pesquisarToken(authorization: string): Promise<string> {

        let token: string = authorization ? authorization : ''

        if (token.length > 0) {

            token = token.replace('Bearer ', '')

            return AppDataSource.getRepository(UsuarioSessao).findOne({ where: { token: token, ativo: true } }).then(rsUsuarioSessao => {

                if (rsUsuarioSessao) {

                    return rsUsuarioSessao.idUsuario

                } else {

                    return ''
                }

            })

        } else {

            return Promise.resolve('')

        }


    }
}