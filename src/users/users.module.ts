import { Module } from '@nestjs/common'; 
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret', // A chave secreta usada para assinar os tokens
      signOptions: { expiresIn: '1h' }, // O token terá validade de 1 hora
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Exportamos o service de usuários, isso permite que outros módulos utilizem o service
})
export class UsersModule {}
