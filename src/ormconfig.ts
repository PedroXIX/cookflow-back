import "reflect-metadata"
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from "./users/entities/user.entity";
import { Receita } from "./receitas/entities/receita.entity";
import { UserActivityLog } from "./logs/entities/user-activity-log.entity";

export const config: TypeOrmModuleOptions = {
  type: "mongodb",
  url: process.env.MONGODB_URI || "mongodb+srv://admin:admin@cluster0.714xxsu.mongodb.net/cookflow?retryWrites=true&w=majority",
  synchronize: true,
  logging: true,
  entities: [User, Receita, UserActivityLog],
};
