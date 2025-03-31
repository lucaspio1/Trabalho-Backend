const { DataTypes } = require('sequelize');
const sequelize = require('../../infrastructure/database/database');

const Plano = sequelize.define('Plano', {
    codigo: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.STRING, allowNull: false },
    custoMensal: { type: DataTypes.FLOAT, allowNull: false },
    descricao: { type: DataTypes.STRING }
});

module.exports = Plano;
