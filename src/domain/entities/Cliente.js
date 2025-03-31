const { DataTypes } = require('sequelize');
const sequelize = require('../../infrastructure/database/database');

const Cliente = sequelize.define('Cliente', {
    codigo: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false }
});

module.exports = Cliente;
