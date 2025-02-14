
import { Injectable, CanActivate, ExecutionContext, Scope } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesInterface } from './roles.interfaces';
import { ROLES_KEY } from './roles.decorator';
// import { GlobalContextService } from '../contexto/GlobalContext.service';
import { RequestContextService } from '../contexto/RequestContext.service';
import ClsAcesso from './ClsAcesso';

@Injectable({ scope: Scope.REQUEST })
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        // private readonly globalContext: GlobalContextService,
        private readonly requestContext: RequestContextService,
    ) {
        // console.log('[RolesGuard] - Construtor')
    }

    canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<RolesInterface>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ])

        // console.log('[RolesGuard] - Regra Recebida: ', requiredRoles)

        // console.log('[RolesGuard] - Contexto Global Usuário: ', this.globalContext.usuarioGlobal)

        // console.log('[RolesGuard] - Contexto Request Usuário: ', this.requestContext.usuarioAtual)

        if (!requiredRoles) {
            return Promise.resolve(true)
        }

        // const request = context.switchToHttp().getRequest();
        // console.log('[RolesGuard] - Request Headers: ', request.headers.authorization)

        // const { usuario } = context.switchToHttp().getRequest();

        const clsAcesso: ClsAcesso = new ClsAcesso()

        return clsAcesso.checarAcesso(this.requestContext.usuarioAtual, requiredRoles.modulo, requiredRoles.permissao).then(rs => {
            return rs
        })

    }
}
