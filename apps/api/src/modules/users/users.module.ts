import { Global, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { FormsModule } from '../forms/forms.module';
import { FormsService } from '../forms/forms.service';
import { ShowcasesModule } from '../showcases/showcases.module';
import { ShowcasesService } from '../showcases/showcases.service';
import { LocalStrategy } from '../auth/strategies/local.strategy';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';

@Global()
@Module({
  imports: [FormsModule, ShowcasesModule],
  controllers: [UsersController],
  providers: [UsersService, FormsService, ShowcasesService, LocalStrategy, JwtStrategy],
  exports: [UsersService],
})
export class UsersModule {}
