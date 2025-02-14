import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {

    constructor() {
        console.log('[RequestContextService] - Constructor')
    }

    public usuarioAtual: string = ''

}