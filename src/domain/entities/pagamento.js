const { DataTypes } = require('sequelize');
const sequelize = require('../../infrastructure/database/database');

const Pagamento = sequelize.define('Pagamento', {
    codigo: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    codAss: { type: DataTypes.INTEGER, allowNull: false },
    valorPago: { type: DataTypes.FLOAT, allowNull: false },
    dataPagamento: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
});

module.exports = Pagamento;