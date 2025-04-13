import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReceitaDto } from './dto/create-receita.dto';
import { UpdateReceitaDto } from './dto/update-receita.dto';
import { ObjectId, Repository } from 'typeorm';
import { Receita } from './entities/receita.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ReceitasService {
  constructor(
    @InjectRepository(Receita)
    private receitasRepository: Repository<Receita>,
  ) {}

  async create(createUserDto: CreateReceitaDto) {
    const receita = this.receitasRepository.create(createUserDto);
    return this.receitasRepository.save(receita);
  }
  
  findAll() {
    return this.receitasRepository.find();
  }

  async findOne(id: string) {
    try {
      const objectId = new ObjectId(id);
      
      // Tentativa 1: usando _id (padrão do MongoDB)
      let receita = await this.receitasRepository.findOneBy({ _id: objectId });
      
      return receita;
    } catch (error) {
      console.error('Erro ao buscar receita:', error);
      throw new NotFoundException(`Receita não encontrada. Detalhes: ${error.message}`);
    }
  }

  async update(id: string, updateUserDto: UpdateReceitaDto) {
    const objectId = new ObjectId(id);
    const user = await this.receitasRepository.findOne({ where: { _id: objectId } });
    if (!user) {
      throw new NotFoundException('Receita não encontrada');
    }
    this.receitasRepository.merge(user, updateUserDto);
    return this.receitasRepository.save(user);
  }
  
  async remove(id: string) {
    const objectId = new ObjectId(id);
    const receita = await this.receitasRepository.findOne({ where: { _id: objectId } });
    if (!receita) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return this.receitasRepository.remove(receita);
  }
}
