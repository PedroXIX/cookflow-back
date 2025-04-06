import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './ormconfig';
import { ReceitasModule } from './receitas/receitas.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot(config), UsersModule, ReceitasModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
