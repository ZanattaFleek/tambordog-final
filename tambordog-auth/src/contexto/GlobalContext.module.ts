import { Module, Global } from '@nestjs/common';
import { GlobalContextService } from './GlobalContext.service';

@Global()
@Module({
    // controllers: [CatsController],
    providers: [GlobalContextService],
    exports: [GlobalContextService]
})
export class GlobalContextModule { }