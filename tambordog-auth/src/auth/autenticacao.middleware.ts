import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestContextService } from '../contexto/RequestContext.service';
import ClsAutenticacaoMiddleware from './autenticacao.middleware.cls';

@Injectable()
export class AutenticacaoMiddleware implements NestMiddleware {

    constructor(private readonly requestContextService: RequestContextService) { }

    use(req: Request, res: Response, next: NextFunction) {

        const clsAutenticacaoMiddleware: ClsAutenticacaoMiddleware = new ClsAutenticacaoMiddleware();

        clsAutenticacaoMiddleware.pesquisarToken(req.headers.authorization).then(rs => {

            this.requestContextService.usuarioAtual = rs
            // console.log('Dentro do RS', rs)
            next();
        })

        // console.log('[Autenticação Middleware] - ');

        // console.log('[Autenticação Middleware] - req.body', req.headers.authorization)

    }
}