const fastify = require('fastify')();
const mysql = require('mysql2/promise');
const cors = require('@fastify/cors');


fastify.register(cors);

async function createDatabaseConnection() {
  return await mysql.createConnection({
    host: 'localhost',
    user: 'root',       
    password: '',       
    database: 'loja' 
  });
}


fastify.get('/', async (request, reply) => {
  reply.send("Fastify Funcionando");
});


fastify.get('/produtos', async (request, reply) => {
  let conn = null;

  try {
    conn = await createDatabaseConnection();
    const [rows] = await conn.query("SELECT id, nome, preco, categoria FROM produtos");
    reply.status(200).send(rows);
  } catch (erro) {
    console.error("Erro ao buscar produtos:", erro);
    reply.status(500).send({ mensagem: "Erro ao buscar produtos" });
  } finally {
    if (conn) {
      await conn.end();
    }
  }
});


const start = async () => {
  try {
    await fastify.listen({ port: 8000 });
    console.log("Servidor rodando na porta 8000");
  } catch (err) {
    console.error("Erro ao iniciar o servidor:", err);
    process.exit(1);
  }
};

start();
