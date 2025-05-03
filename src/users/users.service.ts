import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Verificar se o email já existe
    const existingUser = await this.findOneByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Este email já está cadastrado');
    }

    // Prosseguir com a criação do usuário se o email for único
    const password = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({ ...createUserDto, password });
    return this.usersRepository.save(user);
  }
  
  findOneByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }
  
  findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: string) {
    try {
      const objectId = new ObjectId(id);
      
      // Tentativa 1: usando _id (padrão do MongoDB)
      let user = await this.usersRepository.findOneBy({ _id: objectId });
      
      return user;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw new NotFoundException(`Usuário não encontrado. Detalhes: ${error.message}`);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const objectId = new ObjectId(id);
    
    // Verificar se o usuário existe
    const user = await this.usersRepository.findOne({ where: { _id: objectId } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    
    // Verificar se está tentando atualizar o email para um que já existe
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findOneByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('Este email já está cadastrado para outro usuário');
      }
    }
    
    // Atualizar senha se fornecida
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    
    this.usersRepository.merge(user, updateUserDto);
    return this.usersRepository.save(user);
  }
  
  async remove(id: string) {
    const objectId = new ObjectId(id);
    const user = await this.usersRepository.findOne({ where: { _id: objectId } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return this.usersRepository.remove(user);
  }
}