import { Injectable, NotFoundException } from '@nestjs/common';
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
    const password = await bcrypt.hash(createUserDto.password, 10); // Usamos o bcrypt para a hash da senha
    const user = this.usersRepository.create({ ...createUserDto, password }); // Passamos a senha criptografada e o restante dos dados
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
    const user = await this.usersRepository.findOne({ where: { _id: objectId } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
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
