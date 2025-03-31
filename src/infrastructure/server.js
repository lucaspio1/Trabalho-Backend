const express = require('express');
const bodyParser = require('body-parser');
const clienteRoutes = require('./routes/clienteRoutes');
const planoRoutes = require('./routes/planoRoutes');
const assinaturaRoutes = require('./routes/assinaturaRoutes');
const pagamentoRoutes = require('./routes/pagamentoRoutes');
const servicoPlanosAtivosRoutes = require('./routes/ServicoPlanosAtivos');
const db = require('./database/database');

// Definir relações entre modelos
const Cliente = require('../domain/entities/Cliente');
const Plano = require('../domain/entities/Plano');
const Assinatura = require('../domain/entities/Assinatura');
const Pagamento = require('../domain/entities/pagamento');

// Definir associações
Assinatura.belongsTo(Cliente, { foreignKey: 'codCli' });
Cliente.hasMany(Assinatura, { foreignKey: 'codCli' });

Assinatura.belongsTo(Plano, { foreignKey: 'codPlano' });
Plano.hasMany(Assinatura, { foreignKey: 'codPlano' });

Pagamento.belongsTo(Assinatura, { foreignKey: 'codAss' });
Assinatura.hasMany(Pagamento, { foreignKey: 'codAss' });

// Criar aplicação Express
const app = express();
app.use(bodyParser.json());

// Middleware para logs
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rotas
app.use('/gestao/clientes', clienteRoutes);
app.use('/gestao/planos', planoRoutes);
app.use('/gestao/assinaturas', assinaturaRoutes);
app.use('/faturamento/pagamentos', pagamentoRoutes);
app.use('/servico/planos-ativos', servicoPlanosAtivosRoutes);

// Rota de status da API
app.get('/status', (req, res) => {
  res.json({ 
    status: 'online',
    timestamp: new Date(),
    version: '1.0.0'
  });
});

// Tratamento de erro para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Tratamento geral de erros
app.use((err, req, res, next) => {
  console.error('Erro na aplicação:', err);
  res.status(500).json({ error: 'Erro interno no servidor', details: err.message });
});

// Variável para armazenar a instância do servidor
let server;

// Função para iniciar o servidor
const startServer = async () => {
  const PORT = process.env.PORT || 3000;
  
  try {
    // Sincronizar modelos com o banco de dados
    await db.sync();
    console.log('Banco de dados sincronizado');
    
    server = app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
    
    return server;
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
};

// Função para parar o servidor
const stopServer = async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
    server = null;
    console.log('Servidor parado');
  }
};

// Gerenciamento de eventos para término gracioso
process.on('SIGTERM', async () => {
  console.log('SIGTERM recebido. Encerrando servidor...');
  await stopServer();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT recebido. Encerrando servidor...');
  await stopServer();
  process.exit(0);
});

// Iniciar o servidor apenas se este arquivo for executado diretamente
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer, stopServer, db };