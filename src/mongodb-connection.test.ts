import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../src/ormconfig';
import { User } from '../src/users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('MongoDB Connection Test', () => {
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(config),
        TypeOrmModule.forFeature([User])
      ],
    }).compile();

    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should connect to MongoDB Atlas', async () => {
    // Tenta fazer uma consulta simples para verificar a conexão
    const users = await userRepository.find({ take: 1 });
    
    // Não importa se há usuários ou não, o importante é que a consulta não lance exceções
    expect(users).toBeDefined();
  });
});