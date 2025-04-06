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

  create(createReceitaDto: CreateReceitaDto) {
    const receita = this.receitasRepository.create(createReceitaDto);
    return this.receitasRepository.save(receita);
  }

  findAll() {
    return this.receitasRepository.find();
  }

  findOne(id: string) {
    return `This action returns a #${id} receita`;
  }

  async update(id: string, updateReceitaDto: UpdateReceitaDto) {
    const objectId = new ObjectId(id);
    const receita = await this.receitasRepository.findOne({ where: { id: objectId }});
    if (!receita) {
      throw new NotFoundException('Receita não encontrada');
    }
    this.receitasRepository.merge(receita, updateReceitaDto);
    return this.receitasRepository.save(receita);
  }

  remove(id: string) {
    return `This action removes a #${id} receita`;
  }
}
