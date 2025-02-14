/*
const SQL_PERMISSAO_POR_USUARIO = `
SELECT m.modulo, mp.permissao FROM modulospermissoes AS mp 

INNER JOIN modulos AS m
ON mp.idModulo = m.idModulo

INNER JOIN 
(
SELECT grpe.idModuloPermissao FROM gruposusuarios AS grus
INNER JOIN grupospermissoes AS grpe
ON grus.idGrupo = grpe.idGrupo
WHERE grus.idUsuario = 1
UNION ALL
SELECT uspe.idModuloPermissao FROM usuariospermissoes AS uspe
WHERE uspe.idUsuario = 1
) AS permissoes
ON mp.idModuloPermissao = permissoes.idModuloPermissao
`
*/

import { PermissoesTypes } from "../types/PermissoesTypes";

Object.keys(PermissoesTypes).forEach((keyModulo) => {

    const modulo = PermissoesTypes[keyModulo].MODULO;

    Object.keys(PermissoesTypes[keyModulo].PERMISSOES).forEach((keyPermissao) => {

        const permissao = PermissoesTypes[keyModulo].PERMISSOES[keyPermissao];

        console.log(modulo, permissao);

    })

    // console.log(key, PermissoesTypes[key].MODULO);

    // console.log(PermissoesTypes[key].PERMISSOES);

    /*
    Object.keys(PermissoesTypes[key].PERMISSOES).forEach((keyPermissao) => {
        console.log(keyPermissao, PermissoesTypes[key].PERMISSOES[keyPermissao]);
    })


    onAlterarPermissao(PermissoesTypes[key].MODULO,PermissoesTypes[key].PERMISSOES[keyPermissao] )

    const onAlterarPermissao(modulo: string, permissao: string, permitir: boolean) {
    }


    const getPermissoes() {
    }

    */

})
