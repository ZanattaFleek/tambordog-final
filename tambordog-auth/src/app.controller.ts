import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Roles } from './auth/roles.decorator';
import { RequestContextService } from './contexto/RequestContext.service';

@Controller()
export class AppController {

  constructor(
    private readonly appService: AppService,
    private readonly requestContextService: RequestContextService
  ) {
    console.log('[AppController] - Constructor')
  }

  @Post('Usuario')
  @Roles({
    modulo: 'Cadastro de Usuário',
    permissao: 'Consultar Usuário',
  })
  Usuario(@Body() { usuario }: { usuario: string }): Record<string, string> {

    console.log('[AppController] - Usuario')
    console.log('[AppController - Usuario Request', this.requestContextService.usuarioAtual)
    return this.appService.getUsuario(usuario);

  }
}
