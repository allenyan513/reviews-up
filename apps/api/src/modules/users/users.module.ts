import { Global, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { FormsModule } from '../forms/forms.module';
import { FormsService } from '../forms/forms.service';

@Global()
@Module({
  imports: [FormsModule],
  controllers: [UsersController],
  providers: [UsersService, FormsService],
  exports: [UsersService],
})
export class UsersModule {}
