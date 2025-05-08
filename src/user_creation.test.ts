import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../src/ormconfig';
import { User } from '../src/users/entities/user.entity';
import { UsersService } from '../src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { ConflictException } from '@nestjs/common';

describe('UsersService Integration Test', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(config),
        TypeOrmModule.forFeature([User])
      ],
      providers: [UsersService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  // Limpar a base de testes após os testes
  afterAll(async () => {
    const testEmail = 'teste@example.com';
    const user = await userRepository.findOneBy({ email: testEmail });
    if (user) {
      await userRepository.remove(user);
    }
  });

  it('should create a user', async () => {
    const testEmail = 'teste@example.com';
    const createUserDto: CreateUserDto = {
      name: 'Usuário Teste',
      email: testEmail,
      password: 'senha123'
    };

    // Primeiro verificamos se o usuário já existe e removemos para evitar conflito
    const existingUser = await userRepository.findOneBy({ email: testEmail });
    if (existingUser) {
      await userRepository.remove(existingUser);
    }

    // Criamos o usuário
    const user = await usersService.create(createUserDto);

    // Verificações
    expect(user).toBeDefined();
    expect(user.email).toBe(testEmail);
    expect(user.name).toBe('Usuário Teste');
    expect(user._id).toBeDefined();
    expect(user.password).not.toBe('senha123'); // A senha deve estar hasheada
  });

  it('should not create a user with duplicate email', async () => {
    const testEmail = 'teste@example.com';
    const createUserDto: CreateUserDto = {
      name: 'Outro Usuário',
      email: testEmail,
      password: 'outrasenha'
    };

    // Deveria lançar uma exceção de conflito
    await expect(usersService.create(createUserDto))
      .rejects
      .toThrow(ConflictException);
  });
});