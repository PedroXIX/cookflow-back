import { ObjectId } from 'mongodb';
import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity()
export class Receita {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  titulo: string;

  @Column()
  categoria: string; // Exemplo: "Sobremesa", "Prato Principal", etc.

  @Column("array")
  ingredientes: string[]; // Lista de ingredientes

  @Column("array")
  passos: { numero: number; descricao: string; animacao: string; tipo: string; } []; // Cada passo do preparo como um item no array

  @Column()
  tempoPreparo: number;

  @Column()
  descricao: string;

  @Column()
  dificuldade: string;

  @Column()
  porcoes: number; // Quantidade de porções
}

