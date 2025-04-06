import "reflect-metadata"
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { User } from "./users/entities/user.entity";
import { Receita } from "./receitas/entities/receita.entity";

export const config: TypeOrmModuleOptions = {
    type: "mongodb",
    url: "mongodb+srv://admin:admin@clustercookflow0.imrodsg.mongodb.net/?retryWrites=true&w=majority&appName=ClusterCookFlow0",
    synchronize: true,
    logging: true,
    entities: [User, Receita] //Cada entidade criada, deve ser adicionada aqui
  };
