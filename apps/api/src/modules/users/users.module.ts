import { Global, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { FormsModule } from '../forms/forms.module';
import { FormsService } from '../forms/forms.service';
import { ShowcasesModule } from '../showcases/showcases.module';
import { ShowcasesService } from '../showcases/showcases.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';

@Global()
@Module({
  imports: [FormsModule, ShowcasesModule],
  controllers: [UsersController],
  providers: [UsersService, FormsService, ShowcasesService, JwtStrategy],
  exports: [UsersService],
})
export class UsersModule {}
