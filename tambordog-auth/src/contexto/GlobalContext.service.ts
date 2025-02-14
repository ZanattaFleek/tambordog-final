import { Injectable, Scope } from '@nestjs/common';

@Injectable()
export class GlobalContextService {

    constructor() {
        console.log('[GlobalContextService] - Constructor')
    }

    public usuarioGlobal: string = 'Valor Inicial Usuário Global'

}