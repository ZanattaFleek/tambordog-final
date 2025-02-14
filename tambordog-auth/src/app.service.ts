import { Injectable, Scope } from '@nestjs/common';
import { GlobalContextService } from './contexto/GlobalContext.service';
import { RequestContextService } from './contexto/RequestContext.service';

@Injectable()
// @Injectable()
export class AppService {

  constructor(
    private readonly globalContext: GlobalContextService,
    private readonly requestContext: RequestContextService
  ) {
    console.log('[AppService] - Constructor')    
  }

  getUsuario(usuario: string): Record<string, string> {

    let retorno = {
      usuarioGlobal: this.globalContext.usuarioGlobal,
      usuarioRequest: this.requestContext.usuarioAtual
    }

    this.globalContext.usuarioGlobal = usuario
    this.requestContext.usuarioAtual = usuario

    return retorno
  }

}
