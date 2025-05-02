import { IsNotEmpty } from "class-validator";

export class CreateReceitaDto {
    @IsNotEmpty({ message: 'A imagem é obrigatória' })
    imagem: string;
    
    @IsNotEmpty({ message: 'O titulo é obrigatório' })
    titulo: string;
  
    @IsNotEmpty({ message: 'A categoria é obrigatória' })
    categoria: string;
  
    @IsNotEmpty({ message: 'A lista de ingredientes é obrigatória'})
    ingredientes: string[];
  
    @IsNotEmpty({ message: 'A lista de passos é obrigatória'})
    passos: { numero: number; descricao: string; animacao: string; tipo: string; } [];
  
    @IsNotEmpty({ message: 'O tempo de preparo é obrigatório'})
    tempoPreparo: number;
  
    @IsNotEmpty({ message: 'A descrição é obrigatória'})
    descricao: string;
  
    @IsNotEmpty({ message: 'A dificuldade é obrigatória' })
    dificuldade: string;
  
    @IsNotEmpty({ message: 'As porcoes são obrigatórias' })
    porcoes: number;
}
