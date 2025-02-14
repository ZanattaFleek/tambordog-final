import { Body, Controller, Post } from "@nestjs/common";
import { RespostaPadraoInterface } from "../interfaces/padrao.interfaces";
import { Roles } from "../auth/roles.decorator";
import { PermissoesTypes } from "src/types/PermissoesTypes";

@Controller()
export class SomarController {

    constructor() {
        console.log('[SomarController] - Construtor')
    }

    @Post("somar")
    @Roles({ modulo: PermissoesTypes.ATLETA.MODULO, permissao: PermissoesTypes.ATLETA.PERMISSOES.MANUTENCAO })
    public somar(
        @Body("numero01") numero01: number,
        @Body("numero02") numero02: number
    ): Promise<RespostaPadraoInterface<number>> {

        return Promise.resolve({ ok: true, mensagem: 'Soma OK', dados: numero01 + numero02 })

    }

}