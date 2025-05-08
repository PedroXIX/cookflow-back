import { MongoClient } from 'mongodb';

async function testConnection() {
  const uri = process.env.MONGODB_URI || "mongodb+srv://admin:admin@cluster0.714xxsu.mongodb.net/cookflow?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    // Conectar ao MongoDB
    await client.connect();
    console.log('✅ Conexão com MongoDB Atlas estabelecida com sucesso!');

    // Listar bancos de dados disponíveis
    const dbs = await client.db().admin().listDatabases();
    console.log('Bancos de dados disponíveis:');
    dbs.databases.forEach(db => {
      console.log(`- ${db.name}`);
    });

    // Testar acesso às coleções
    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log('\nColeções disponíveis:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });

    console.log('\n✅ Teste de conexão concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar com MongoDB Atlas:', error);
  } finally {
    await client.close();
  }
}

testConnection().catch(console.error);