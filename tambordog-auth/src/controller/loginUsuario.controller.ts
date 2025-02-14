import { Body, Controller, Post } from "@nestjs/common";
import ClsLoginUsuarioController from "./loginUsuario.controller.cls";
import { RespostaPadraoInterface } from "../interfaces/padrao.interfaces";
import { RequestContextService } from "../contexto/RequestContext.service";
import { LoginInterface } from "../interfaces/login.interfaces";

@Controller()
export class LoginUsuarioController {

    constructor(private readonly requestContext: RequestContextService) {
        console.log('[LoginUsuarioController] - Construtor')
    }

    @Post("loginUsuario")
    public loginUsuario(
        @Body("cpf") cpf: string,
        @Body("senha") senha: string
    ): Promise<RespostaPadraoInterface<LoginInterface>> {

        return new ClsLoginUsuarioController().logar(cpf, senha)


    }

    /*
    @Post("permissoesUsuario")
    public permissoesUsuario(): Promise<PermissoesTypesInterface> {
        if (this.requestContext.usuarioAtual) {
            return new ClsLoginUsuarioController().permissoesUsuario(this.requestContext.usuarioAtual)
        } else {
            return Promise.reject()
        }

    }
        */

}