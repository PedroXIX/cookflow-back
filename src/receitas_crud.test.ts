import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../src/ormconfig';
import { Receita } from '../src/receitas/entities/receita.entity';
import { ReceitasService } from '../src/receitas/receitas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReceitaDto } from '../src/receitas/dto/create-receita.dto';
import { ObjectId } from 'mongodb';

describe('ReceitasService Integration Test', () => {
  let receitasService: ReceitasService;
  let receitaRepository: Repository<Receita>;
  let createdReceitaId: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(config),
        TypeOrmModule.forFeature([Receita])
      ],
      providers: [ReceitasService],
    }).compile();

    receitasService = module.get<ReceitasService>(ReceitasService);
    receitaRepository = module.get<Repository<Receita>>(getRepositoryToken(Receita));
  });

  // Limpar a receita de teste após os testes
  afterAll(async () => {
    if (createdReceitaId) {
      try {
        await receitasService.remove(createdReceitaId);
      } catch (error) {
        console.log('Erro ao remover receita de teste:', error);
      }
    }
  });

  it('should create a recipe', async () => {
    const createReceitaDto: CreateReceitaDto = {
      titulo: 'Bolo de Chocolate',
      imagem: 'https://example.com/bolo.jpg',
      categoria: 'Sobremesa',
      ingredientes: ['Chocolate', 'Farinha', 'Ovos', 'Açúcar'],
      passos: [
        { numero: 1, descricao: 'Misturar os ingredientes secos', animacao: '', tipo: 'preparo' },
        { numero: 2, descricao: 'Adicionar os ovos e bater', animacao: '', tipo: 'preparo' }
      ],
      tempoPreparo: 45,
      descricao: 'Um delicioso bolo de chocolate',
      dificuldade: 'Fácil',
      porcoes: 8,
      calorias: 350,
      rating: 4.5
    };

    const receita = await receitasService.create(createReceitaDto);

    // Verificações
    expect(receita).toBeDefined();
    expect(receita.titulo).toBe('Bolo de Chocolate');
    expect(receita._id).toBeDefined();
    
    // Guardar o ID para uso em outros testes
    createdReceitaId = receita._id.toString();
  });

  it('should find all recipes', async () => {
    const receitas = await receitasService.findAll();
    expect(receitas).toBeDefined();
    expect(Array.isArray(receitas)).toBe(true);
  });

  it('should find a recipe by id', async () => {
    const receita = await receitasService.findOne(createdReceitaId);
    
    expect(receita).toBeDefined();
    expect(receita?.titulo).toBe('Bolo de Chocolate');
  });
  

  it('should update a recipe', async () => {
    const updateData = {
      titulo: 'Bolo de Chocolate Atualizado',
      dificuldade: 'Médio'
    };

    const updatedReceita = await receitasService.update(createdReceitaId, updateData);
    expect(updatedReceita).toBeDefined();
    expect(updatedReceita.titulo).toBe('Bolo de Chocolate Atualizado');
    expect(updatedReceita.dificuldade).toBe('Médio');
  });
});