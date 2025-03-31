
const { db } = require('../src/infrastructure/server');

beforeAll(async () => {
  // Sincronizar banco de dados antes de todos os testes
  await db.sync({ force: true });
});

afterAll(async () => {
  // Fechar conexão com o banco de dados após todos os testes
  await db.close();
});