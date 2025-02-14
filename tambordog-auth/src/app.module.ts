import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalContextModule } from './contexto/GlobalContext.module';
import { RequestContextService } from './contexto/RequestContext.service';
import { AutenticacaoMiddleware } from './auth/autenticacao.middleware';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { LoginUsuarioController } from './controller/loginUsuario.controller';
import { SomarController } from './controller/somar.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [GlobalContextModule, ConfigModule.forRoot(
    {
      envFilePath: '.env',
    }
  )],
  controllers: [AppController, LoginUsuarioController, SomarController],
  providers: [AppService, RequestContextService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: []
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AutenticacaoMiddleware)
      .forRoutes('*');
  }
}
