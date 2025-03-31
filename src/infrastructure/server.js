const express = require('express');
const bodyParser = require('body-parser');
const clienteRoutes = require('./routes/clienteRoutes');
const planoRoutes = require('./routes/planoRoutes');
const assinaturaRoutes = require('./routes/assinaturaRoutes');
const pagamentoRoutes = require('./routes/pagamentoRoutes');
const db = require('./database/database');

// Criar aplicação Express
const app = express();
app.use(bodyParser.json());

// Rotas
app.use('/gestao/clientes', clienteRoutes);
app.use('/gestao/planos', planoRoutes);
app.use('/gestao/assinaturas', assinaturaRoutes);
app.use('/faturamento/pagamentos', pagamentoRoutes);

// Variável para armazenar a instância do servidor
let server;

// Função para iniciar o servidor
const startServer = async () => {
  const PORT = process.env.PORT || 3000;
  server = app.listen(PORT, async () => {
    await db.sync();
    console.log(`Servidor rodando na porta ${PORT}`);
  });
  return server;
};

// Função para parar o servidor
const stopServer = async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
    server = null;
  }
};

// Iniciar o servidor apenas se este arquivo for executado diretamente
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer, stopServer, db };