const Cliente = require('../domain/entities/Cliente');
const Plano = require('../domain/entities/Plano');
const Assinatura = require('../domain/entities/Assinatura');
const Pagamento = require('../domain/entities/Pagamento');

// Definir associações
Assinatura.belongsTo(Cliente, { foreignKey: 'codCli' });
Cliente.hasMany(Assinatura, { foreignKey: 'codCli' });

Assinatura.belongsTo(Plano, { foreignKey: 'codPlano' });
Plano.hasMany(Assinatura, { foreignKey: 'codPlano' });

Pagamento.belongsTo(Assinatura, { foreignKey: 'codAss' });
Assinatura.hasMany(Pagamento, { foreignKey: 'codAss' });

module.exports = {
  Cliente,
  Plano,
  Assinatura,
  Pagamento
};