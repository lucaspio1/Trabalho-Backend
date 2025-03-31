
const { DataTypes } = require('sequelize');
const sequelize = require('../../infrastructure/database/database');

const Assinatura = sequelize.define('Assinatura', {
    codigo: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    codPlano: { type: DataTypes.INTEGER, allowNull: false },
    codCli: { type: DataTypes.INTEGER, allowNull: false },
    inicioFidelidade: { type: DataTypes.DATE, allowNull: false },
    fimFidelidade: { type: DataTypes.DATE, allowNull: false },
    dataUltimoPagamento: { type: DataTypes.DATE },
    custoFinal: { type: DataTypes.FLOAT },
    descricao: { type: DataTypes.STRING }
});

module.exports = Assinatura;
