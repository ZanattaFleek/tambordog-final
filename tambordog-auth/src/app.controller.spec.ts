import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestContextService } from './contexto/RequestContext.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, RequestContextService,
        {
          provide: APP_GUARD,
          useClass: RolesGuard,
        },
      ],
      exports: []
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.Usuario({ usuario: 'Zanatta' })).toBe('Hello World!');
    });
  });
});
