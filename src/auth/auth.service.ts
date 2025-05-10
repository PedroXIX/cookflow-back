// auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LogsService } from 'src/logs/logs.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private logsService: LogsService, // Injetar o serviço de logs
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, _id: user._id };
    
    // Registrar o login do usuário
    await this.logsService.logUserActivity(
      user._id.toString(),
      'login',
      'Login realizado com sucesso'
    );
    
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}